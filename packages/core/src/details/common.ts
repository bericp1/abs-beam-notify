export interface APSBeamDetails {
  beamCurrent: string | null;
  operationStatus: string | null;
  beamlinesOperating: string | null;
  globalFeedback: string | null;
  localSteering: string | null;
  operatorsInCharge: string | null;
  floorCoordinator: string | null;
  fillPattern: string | null;
  problemInformation: string | null;
  lastDumpTripReason: string | null;
  nextFillInformation: string | null;
  historyPlotPNGSrc: string | null;
}

export const APS_BEAM_DETAIL_LABELS: Record<keyof APSBeamDetails, string> = {
  beamCurrent: 'Beam Current',
  operationStatus: 'Operations Status',
  beamlinesOperating: 'Beamlines Operating',
  globalFeedback: 'Global Feedback',
  localSteering: 'Local Steering',
  operatorsInCharge: 'Operators in Charge',
  floorCoordinator: 'Floor Coordinator',
  fillPattern: 'Fill Pattern',
  problemInformation: 'Problem Information',
  lastDumpTripReason: 'Last Dump/Trip Reason',
  nextFillInformation: 'Next Fill Information',
  historyPlotPNGSrc: 'History Plot',
};
