import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import Stripe from 'stripe';
import { getDb, saveDb, Product } from './db.js';

// IMPORTANT: Use your actual Stripe Secret Key in production.
const stripeSecretKey = process.env['STRIPE_SECRET_KEY'] || 'sk_test_mock_if_not_provided';
const stripe = new Stripe(stripeSecretKey);

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Parse JSON bodies for API endpoints (except webhook if implemented later)
app.use('/api', express.json());

app.get('/api/products', (req, res) => {
  const db = getDb();
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const db = getDb();
  const product: Product = {
    id: `prod_${Date.now()}`,
    ...req.body
  };
  db.products.push(product);
  saveDb(db);
  res.json(product);
});

app.get('/api/orders', (req, res) => {
  const db = getDb();
  res.json(db.orders);
});

app.post('/api/checkout', async (req, res) => {
  try {
    const db = getDb();
    const { productId } = req.body;
    const product = db.products.find(p => p.id === productId);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const appUrl = process.env['APP_URL'] || `http://localhost:${process.env['PORT'] || 4000}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      metadata: {
        productId: product.id,
      }
    });

    res.json({ url: session.url });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// A simple webhook simulation or check for successful order (in real app, use Stripe Webhook)
app.post('/api/verify-checkout', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const db = getDb();
      // Avoid duplicate order
      if (!db.orders.find(o => o.sessionId === sessionId)) {
        db.orders.push({
           id: `ord_${Date.now()}`,
           sessionId: session.id,
           customerName: session.customer_details?.name || 'Unknown',
           customerEmail: session.customer_details?.email || 'unknown@example.com',
           productId: session.metadata?.['productId'] || '',
           amount: session.amount_total || 0,
           status: 'success',
           createdAt: new Date().toISOString()
        });
        saveDb(db);
      }
      res.json({ success: true });
    } else {
      res.json({ success: false, status: session.payment_status });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
