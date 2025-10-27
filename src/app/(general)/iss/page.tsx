import ISSTrackerComponent from "@/modules/iss/components/iss-tracker-component";
import { Suspense } from "react";

const ISSTrackerPage = () => {
  return (
    <Suspense>
      <ISSTrackerComponent />
    </Suspense>
  );
};

export default ISSTrackerPage;
