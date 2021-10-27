import NotFound from "@/components/NotFound";
import CreateVesting from "@/components/CreateVesting";
import VestingScheduleList from "@/components/VestingScheduleList";
import AdminPanel from "@/components/AdminPanel";
import DeployVestingContract from "@/components/DeployVestingContract";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/vesting",
    component: VestingScheduleList,
  },
  { path: "/owner/vesting/new", component: CreateVesting },
  { path: "/owner/admin", component: AdminPanel },
  { path: "/vesting", component: VestingScheduleList },
  { path: "/misc/vesting/deploy", component: DeployVestingContract },
  { path: "*", component: NotFound },
];

export default routes;
