import * as React from "react";
import { useQuery } from "react-query";
import fileSize from "filesize";

export const SLUG_STORAGE = "storage";

function StorageUsage() {
  const { data } = useQuery<ISubscription>("/subscription/me");

  const featureStorage = data?.plan.features.find((s) =>
    s.slug.includes(SLUG_STORAGE)
  );

  const usageStorage = data?.usages.find((s) =>
    s.feature.slug.includes(SLUG_STORAGE)
  );

  // Validation if is string or boolean
  //  functioon inc and dec
  const totalUsage =
    Number(featureStorage?.value ?? 0) - Number(usageStorage?.used ?? 0);

  const percentage = (
    (Number(usageStorage?.used ?? 0) / Number(featureStorage?.value ?? 0)) *
    100
  ).toFixed(2);

  return (
    <div className="inline-block text-sm font-medium text-gray-800 text-center bg-gray-200 rounded-lg py-1 px-2">
      Usage: {fileSize(totalUsage)} /{" "}
      {fileSize(Number(featureStorage?.value ?? 0))} ({percentage}%)
    </div>
  );
}

export default React.memo(StorageUsage);
