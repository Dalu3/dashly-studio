const findById = (items, id) => items.find((item) => item.id === id);

const roundTo = (value, increment) => Math.round(value / increment) * increment;

export function calculateEstimate(answers, config) {
    const website = findById(config.websiteTypes, answers.websiteTypeId);
    const startingPoint = findById(config.startingPoints, answers.startingPointId);
    const minimumPageCount = config.pageRange?.minimum ?? 1;
    const maximumPageCount = config.pageRange?.maximum ?? Number.POSITIVE_INFINITY;
    const pageCount = Math.min(
        maximumPageCount,
        Math.max(minimumPageCount, Number(answers.pageCount) || minimumPageCount),
    );
    const basePrice = website?.basePrice ?? 0;
    const extraPages = website && Number.isFinite(website.includedPages)
        ? Math.max(0, pageCount - website.includedPages)
        : 0;
    const extraPagesPrice = extraPages * config.extraPagePrice;
    const selectedFeatures = config.features.filter((feature) => (
        feature.appliesTo.includes(answers.websiteTypeId)
        && answers.featureIds.includes(feature.id)
    ));
    const featureLines = selectedFeatures
        .filter((feature) => Number.isFinite(feature.price))
        .map((feature) => ({ id: `feature-${feature.id}`, label: feature.label, amount: feature.price }));
    const featuresPrice = featureLines.reduce((sum, item) => sum + item.amount, 0);
    const subtotal = basePrice + extraPagesPrice + featuresPrice;
    const configuredStartingPointAdjustment = startingPoint?.priceAdjustments?.[website?.id];
    const startingPointAdjustment = Number.isFinite(configuredStartingPointAdjustment)
        ? configuredStartingPointAdjustment
        : Math.round(subtotal * ((startingPoint?.multiplier ?? 1) - 1));
    const total = subtotal + startingPointAdjustment;
    const { minimumMultiplier, maximumMultiplier, rounding } = config.estimateRange;
    const range = {
        minimum: roundTo(total * minimumMultiplier, rounding),
        maximum: roundTo(total * maximumMultiplier, rounding),
    };
    const breakdown = [
        website && { id: "base", label: website.label, amount: basePrice },
        extraPages > 0 && { id: "pages", label: `${extraPages} additional page${extraPages === 1 ? "" : "s"}`, amount: extraPagesPrice },
        ...featureLines,
        startingPointAdjustment !== 0 && { id: "starting-point", label: startingPoint?.label ?? "Starting point", amount: startingPointAdjustment },
    ].filter(Boolean);

    return { pageCount, basePrice, extraPages, extraPagesPrice, featuresPrice, subtotal, startingPointAdjustment, total, range, breakdown };
}

export function createEstimateSummary(answers, estimate, config) {
    const find = (items, id) => findById(items, id);
    const website = find(config.websiteTypes, answers.websiteTypeId);
    const isDirectContact = Boolean(website?.directContact);

    return {
        websiteType: website?.label ?? "",
        pageCount: estimate.pageCount,
        features: config.features
            .filter((item) => item.appliesTo.includes(answers.websiteTypeId) && answers.featureIds.includes(item.id))
            .map((item) => item.label),
        startingPoint: find(config.startingPoints, answers.startingPointId)?.label ?? "",
        estimate: isDirectContact ? null : estimate.total,
        estimateRange: isDirectContact ? null : estimate.range,
        breakdown: estimate.breakdown,
    };
}
