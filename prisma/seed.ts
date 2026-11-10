import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { INITIAL_EVENTS, INITIAL_VENDORS } from '../data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Eventory Neon DB database seeding...');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Seed Demo Users
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@eventory.ng' },
    update: {},
    create: {
      email: 'creator@eventory.ng',
      name: 'Ezekiel Adeleke',
      passwordHash: defaultPassword,
      role: UserRole.creator,
      phone: '+234 803 111 2233',
      organizationName: 'Nexus Ventures Africa',
    },
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@eventory.ng' },
    update: {},
    create: {
      email: 'vendor@eventory.ng',
      name: 'Chef Amaka Nwosu',
      passwordHash: defaultPassword,
      role: UserRole.vendor,
      phone: '+234 802 999 8877',
      organizationName: 'Savanna Gourmet Caterers',
    },
  });

  console.log(`👤 Seeded demo users: ${creatorUser.email}, ${vendorUser.email}`);

  // 2. Seed Events and Ticket Tiers
  for (const evt of INITIAL_EVENTS) {
    const createdEvent = await prisma.event.upsert({
      where: { slug: evt.slug },
      update: {
        title: evt.title,
        organizerName: evt.organizer,
        category: evt.category,
        date: evt.date,
        time: evt.time,
        venue: evt.venue,
        city: evt.city,
        state: evt.state,
        image: evt.image,
        description: evt.description,
        startingPrice: evt.startingPrice,
        currency: evt.currency,
        ticketsSold: evt.ticketsSold,
        capacity: evt.capacity,
        featured: evt.featured ?? false,
        editorialTag: evt.editorialTag ?? null,
        refundPolicy: evt.refundPolicy ?? null,
        userId: creatorUser.id,
      },
      create: {
        id: evt.id,
        title: evt.title,
        slug: evt.slug,
        organizerName: evt.organizer,
        organizerVerified: evt.organizerVerified,
        category: evt.category,
        date: evt.date,
        time: evt.time,
        venue: evt.venue,
        city: evt.city,
        state: evt.state,
        image: evt.image,
        description: evt.description,
        startingPrice: evt.startingPrice,
        currency: evt.currency,
        ticketsSold: evt.ticketsSold,
        capacity: evt.capacity,
        featured: evt.featured ?? false,
        editorialTag: evt.editorialTag ?? null,
        refundPolicy: evt.refundPolicy ?? null,
        userId: creatorUser.id,
      },
    });

    // Create or update tiers
    for (const tier of evt.ticketTiers) {
      await prisma.ticketTier.upsert({
        where: { id: tier.id },
        update: {
          name: tier.name,
          price: tier.price,
          description: tier.description,
          remaining: tier.remaining,
        },
        create: {
          id: tier.id,
          eventId: createdEvent.id,
          name: tier.name,
          price: tier.price,
          description: tier.description,
          remaining: tier.remaining,
          capacity: tier.remaining,
        },
      });
    }
  }

  console.log(`🎟️ Seeded ${INITIAL_EVENTS.length} events and ticket tiers.`);

  // 3. Seed Vendors, Packages & Reviews
  for (const vnd of INITIAL_VENDORS) {
    const createdVendor = await prisma.vendor.upsert({
      where: { id: vnd.id },
      update: {
        businessName: vnd.businessName,
        category: vnd.category,
        city: vnd.city,
        locationAddress: vnd.locationAddress,
        guestCapacity: vnd.guestCapacity ?? null,
        priceFrom: vnd.priceFrom,
        rating: vnd.rating,
        reviewsCount: vnd.reviewsCount,
        responseRate: vnd.responseRate,
        verified: vnd.verified,
        cacRegistered: vnd.cacRegistered,
        cacNumber: vnd.cacNumber ?? null,
        image: vnd.image,
        portfolio: vnd.portfolio,
        description: vnd.description,
        servicesIncluded: vnd.servicesIncluded,
        bookedCount: vnd.bookedCount,
      },
      create: {
        id: vnd.id,
        businessName: vnd.businessName,
        category: vnd.category,
        city: vnd.city,
        locationAddress: vnd.locationAddress,
        guestCapacity: vnd.guestCapacity ?? null,
        priceFrom: vnd.priceFrom,
        rating: vnd.rating,
        reviewsCount: vnd.reviewsCount,
        responseRate: vnd.responseRate,
        verified: vnd.verified,
        cacRegistered: vnd.cacRegistered,
        cacNumber: vnd.cacNumber ?? null,
        image: vnd.image,
        portfolio: vnd.portfolio,
        description: vnd.description,
        servicesIncluded: vnd.servicesIncluded,
        bookedCount: vnd.bookedCount,
      },
    });

    // Seed packages
    if (vnd.packages) {
      for (const pkg of vnd.packages) {
        await prisma.vendorPackage.upsert({
          where: { id: pkg.id },
          update: {
            name: pkg.name,
            price: pkg.price,
            description: pkg.description,
            features: pkg.features,
          },
          create: {
            id: pkg.id,
            vendorId: createdVendor.id,
            name: pkg.name,
            price: pkg.price,
            description: pkg.description,
            features: pkg.features,
          },
        });
      }
    }

    // Seed reviews
    if (vnd.reviews) {
      for (let i = 0; i < vnd.reviews.length; i++) {
        const rev = vnd.reviews[i];
        const revId = `${createdVendor.id}-rev-${i + 1}`;
        await prisma.vendorReview.upsert({
          where: { id: revId },
          update: {
            author: rev.author,
            eventType: rev.eventType,
            date: rev.date,
            rating: rev.rating,
            comment: rev.comment,
          },
          create: {
            id: revId,
            vendorId: createdVendor.id,
            author: rev.author,
            eventType: rev.eventType,
            date: rev.date,
            rating: rev.rating,
            comment: rev.comment,
          },
        });
      }
    }
  }

  console.log(`🛍️ Seeded ${INITIAL_VENDORS.length} vendors with packages and reviews.`);
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
