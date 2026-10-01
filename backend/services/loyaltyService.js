const Loyalty = require('../models/Loyalty');
const Activity = require('../models/Activity');
const SiteSettings = require('../models/SiteSettings');

const DEFAULT_ACTION_POINTS = {
  view: 250,
  cart: 500,
  wishlist: 300,
};

const VIEW_AWARD_COOLDOWN_MS = 30000;

// Points are fully controllable from the Admin → Settings panel.
async function getActionPoints() {
  try {
    const doc = await SiteSettings.load();
    return {
      view: Number(doc.pointsView) || DEFAULT_ACTION_POINTS.view,
      cart: Number(doc.pointsCart) || DEFAULT_ACTION_POINTS.cart,
      wishlist: Number(doc.pointsWishlist) || DEFAULT_ACTION_POINTS.wishlist,
    };
  } catch (err) {
    return DEFAULT_ACTION_POINTS;
  }
}

async function recentActivityCount(userId, type, windowMs) {
  const since = new Date(Date.now() - windowMs);
  return Activity.countDocuments({ user: userId, type, createdAt: { $gte: since } });
}

async function awardPointsForActivity(userId, type) {
  const points = (await getActionPoints())[type];
  if (!points) return null;

  try {
    const settings = await SiteSettings.load();
    if (settings.loyaltyEnabled === false) return null;
  } catch (err) {
    /* default to enabled */
  }

  if (type === 'view') {
    const recent = await recentActivityCount(userId, 'view', VIEW_AWARD_COOLDOWN_MS);
    if (recent > 0) return null;
  }

  let loyalty = await Loyalty.findOne({ user: userId });
  if (!loyalty) {
    loyalty = new Loyalty({ user: userId });
  }
  loyalty.addPoints(points, `Real action: ${type}`);
  const previousTier = loyalty.tier;
  await loyalty.save();
  if (loyalty.tier !== previousTier) {
    loyalty.history.push({
      type: 'earned',
      points: 0,
      reason: `Tier upgraded to ${loyalty.tier}`,
    });
    await loyalty.save();
  }
  return loyalty;
}

async function awardOrderPoints(userId, order, total) {
  let perOrder = 1;
  try {
    const settings = await SiteSettings.load();
    if (settings.loyaltyEnabled === false) return null;
    perOrder = Math.max(1, Number(settings.pointsPerOrder) || 1);
  } catch (err) {
    /* default */
  }
  const points = Math.max(500, Math.floor((total || 0) / perOrder));
  let loyalty = await Loyalty.findOne({ user: userId });
  if (!loyalty) {
    loyalty = new Loyalty({ user: userId });
  }
  loyalty.addPoints(points, `Order confirmed: ${order._id}`, order._id);
  await loyalty.save();
  return loyalty;
}

module.exports = {
  ACTION_POINTS: DEFAULT_ACTION_POINTS,
  awardPointsForActivity,
  awardOrderPoints,
};