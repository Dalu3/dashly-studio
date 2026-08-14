export const OPEN_ESTIMATOR_EVENT = "dashly:open-estimator";
export const ESTIMATE_HANDOFF_EVENT = "dashly:estimate-handoff";

export function openEstimator(trigger) {
    window.dispatchEvent(new CustomEvent(OPEN_ESTIMATOR_EVENT, { detail: { trigger } }));
}
