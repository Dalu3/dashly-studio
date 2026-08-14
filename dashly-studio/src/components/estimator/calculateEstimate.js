const findById = (items, id) => items.find((item) => item.id === id);

export function calculateEstimate(answers, config) {
    const website = findById(config.websiteTypes, answers.websiteTypeId);
    const content = findById(config.contentOptions, answers.contentOptionId);
    const timeline = findById(config.timelineOptions, answers.timelineOptionId);
    const ecommerce = website?.id === "ecommerce"
        ? findById(config.ecommerceProductTiers, answers.ecommerceTierId)
        : undefined;
    const basePrice = website?.basePrice ?? 0;
    const extraPages = website && website.includedPages !== null
        ? Math.max(0, answers.pageCount - website.includedPages)
        : 0;
    const extraPagesPrice = extraPages * config.extraPagePrice;
    const selectedFeatures = config.features.filter((feature) => answers.featureIds.includes(feature.id));
    const featureLines = selectedFeatures.map((feature) => {
        const quantity = Math.max(1, answers.featureQuantities[feature.id] ?? 1);
        return { id: `feature-${feature.id}`, label: quantity > 1 ? `${feature.label} × ${quantity}` : feature.label, amount: feature.price * quantity };
    });
    const featuresPrice = featureLines.reduce((sum, item) => sum + item.amount, 0);
    const contentPrice = content?.price ?? 0;
    const ecommercePrice = ecommerce?.price ?? 0;
    const subtotal = basePrice + extraPagesPrice + featuresPrice + contentPrice + ecommercePrice;
    const priorityPrice = Math.round(subtotal * (timeline?.multiplier ?? 0));
    const total = subtotal + priorityPrice;
    const breakdown = [
        website && { id: "base", label: website.label, amount: basePrice },
        extraPages > 0 && { id: "pages", label: `${extraPages} additional page${extraPages === 1 ? "" : "s"}`, amount: extraPagesPrice },
        ...featureLines,
        content?.price > 0 && { id: "content", label: content.label, amount: contentPrice },
        ecommerce?.price > 0 && { id: "ecommerce", label: `${ecommerce.label} products`, amount: ecommercePrice },
        priorityPrice > 0 && { id: "priority", label: "Priority", amount: priorityPrice },
    ].filter(Boolean);
    return { basePrice, extraPages, extraPagesPrice, featuresPrice, contentPrice, ecommercePrice, subtotal, priorityPrice, total, breakdown };
}

export function createEstimateSummary(answers, estimate, config) {
    const find = (items, id) => findById(items, id);
    return {
        websiteType: find(config.websiteTypes, answers.websiteTypeId)?.label ?? "",
        pageCount: answers.pageCount,
        features: config.features.filter((item) => answers.featureIds.includes(item.id)).map((item) => item.label),
        ecommerceTier: answers.websiteTypeId === "ecommerce" ? find(config.ecommerceProductTiers, answers.ecommerceTierId)?.label ?? "" : "",
        contentReadiness: find(config.contentOptions, answers.contentOptionId)?.label ?? "",
        timeline: find(config.timelineOptions, answers.timelineOptionId)?.label ?? "",
        estimate: estimate.total,
        breakdown: estimate.breakdown,
    };
}
