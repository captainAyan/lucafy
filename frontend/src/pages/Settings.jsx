import PreferenceSettings from "../components/PreferenceSettings";
import ChangePasswordSettings from "../components/ChangePasswordSettings";
import NormalizationSettings from "../components/NormalizationSettings";
import DeleteAccountSettings from "../components/DeleteAccountSettings";

export default function Settings() {
  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4 mb-8">
          <h1 className="text-4xl font-bold text-left">Settings</h1>
        </div>

        <PreferenceSettings />

        <DeleteAccountSettings />

        <NormalizationSettings />

        <ChangePasswordSettings />
      </center>
    </div>
  );
}
