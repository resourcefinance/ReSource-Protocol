import { percentage, toEth } from "./utils";
const humanizeDuration = require("humanize-duration");

export function formatVestingSchedule(vestingScheduleWrapper, index = 0) {
  const vestingScheduleRaw = vestingScheduleWrapper.raw;
  const startTimestamp = vestingScheduleRaw.start * 1000;
  const endTimestamp = startTimestamp + vestingScheduleRaw.duration * 1000;
  const startDateFromTimestamp = new Date(startTimestamp);
  const startDate = startDateFromTimestamp.toLocaleDateString();
  const startTime = startDateFromTimestamp.toLocaleTimeString();
  const start = `${startDate} ${startTime}`;
  const endDateFromTimestamp = new Date(endTimestamp);
  const endDate = endDateFromTimestamp.toLocaleDateString();
  const endTime = endDateFromTimestamp.toLocaleTimeString();
  const end = `${endDate} ${endTime}`;
  const amountFmt = toEth(vestingScheduleRaw.amountTotal);
  const releasedFmt = toEth(vestingScheduleRaw.released);
  const releasableAmountFmt = toEth(vestingScheduleWrapper.releasableAmount);
  const vestedAmountFmt = toEth(vestingScheduleWrapper.vestedAmount);

  const vestedPercentage = percentage(
    vestingScheduleWrapper.vestedAmount,
    vestingScheduleRaw.amountTotal
  );
  const releasedOverTotalPercentage = percentage(
    vestingScheduleRaw.released,
    vestingScheduleRaw.amountTotal
  );
  const releasedOverVestedPercentage = percentage(
    vestingScheduleRaw.released,
    vestingScheduleWrapper.vestedAmount
  );

  const vestingSchedule = {
    vestingScheduleId: vestingScheduleWrapper.vestingScheduleId,
    index: index,
    beneficiary: vestingScheduleRaw.beneficiary,
    start: start,
    end: end,
    amount: amountFmt,
    released: releasedFmt,
    revocable: vestingScheduleRaw.revocable,
    duration: humanizeDuration(vestingScheduleRaw.duration * 1000),
    vestedAmount: vestedAmountFmt,
    releasableAmount: releasableAmountFmt,
    status: vestingScheduleRaw.revoked ? "revoked" : "active",
    vestedPercentage: vestedPercentage,
    releasedOverTotalPercentage: releasedOverTotalPercentage,
    releasedOverVestedPercentage: releasedOverVestedPercentage,
  };
  vestingSchedule.raw = vestingScheduleRaw;
  return vestingSchedule;
}
