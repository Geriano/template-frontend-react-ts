import { useAppSelector } from "../../hooks";
import GeneralInformation from "./Profile/GeneralInformation";
import UpdatePassword from "./Profile/UpdatePassword";

export default function Profile() {
  const { user } = useAppSelector(state => state.auth)

  return (
    <div className="grid md:grid-cols-12 gap-4">
      <GeneralInformation user={user} />
      <UpdatePassword user={user} />
    </div>
  )
}