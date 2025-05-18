import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <main className="mt-4 max-w-2xl mx-auto p-4 bg-white rounded-xl">
        <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
        <center className="mb-4">
          <Link to="/">
            <span className="text-md text-gray-500 hover:underline">
              Home <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </center>
        <section>
          <p className="mb-8">
            Lucafy is a personal accounting web application designed to help
            individuals take control of their finances using the principles of
            double-entry bookkeeping. Whether you&apos;re managing freelance
            income, personal expenses, or simply want a clearer picture of your
            financial activity, Lucafy provides a clean, intuitive interface to
            do just that.
          </p>
          <p className="mb-8">
            Built with the MERN stack (MongoDB, Express, React, and Node.js),
            Lucafy brings the structure of professional accounting systems to
            everyday users. It allows you to record journal entries, manage
            ledgers, and view key financial statements like trial balances — all
            in one place.
          </p>
          <p className="mb-8">
            This project was created out of a passion for personal finance and
            better tools for tracking it. Lucafy is open-source and free to use,
            with ongoing updates and improvements. If you&apos;re interested in
            how it works under the hood or want to contribute, check out the
            GitHub repository.
          </p>
        </section>

        <section id="privacy">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="mb-4 font-medium">Last updated: 18th May, 2025</p>

          <p className="mb-4">
            Lucafy is a personal accounting web app built to help users manage
            their finances using double-entry bookkeeping. This policy outlines
            what data we collect and how it&apos;s handled.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            1. What We Collect
          </h2>
          <p className="mb-2">To create an account, users must provide:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>First name</li>
            <li>Last name</li>
            <li>Email address</li>
            <li>Password</li>
          </ul>
          <p className="mb-4">
            Users may also input financial data (journal entries, ledgers, etc.)
            during normal use of the app.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            2. How Data is Stored
          </h2>
          <p className="mb-4">
            All user data, including financial records, is stored securely in{" "}
            <strong>MongoDB Atlas</strong>, which is hosted on{" "}
            <strong>Amazon Web Services (AWS)</strong>.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Deletion</h2>
          <p className="mb-4">
            If a user deletes their account,{" "}
            <strong>all associated data is deleted immediately</strong> —
            including personal details and financial records. This action is
            irreversible.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. Downloading Your Data
          </h2>
          <p className="mb-4">
            Users can export their journal entries and ledger data at any time.
            This feature is available within the app.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            5. Cookies and Tracking
          </h2>
          <p className="mb-4">
            Lucafy may use minimal cookies for session management and app
            functionality. We don&apos;t use tracking scripts, ads, or
            third-party analytics.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes</h2>
          <p className="mb-4">
            This policy may be updated periodically. Updates will be posted
            here, and continued use of the app means you accept any changes.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
          <p className="mb-4">
            If you have questions or concerns, please reach out via the GitHub
            repository:{" "}
            <a
              href="https://github.com/captainayan/Lucafy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github.com/captainayan/Lucafy
            </a>
          </p>
        </section>

        <section id="tnc">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <p className="mb-4 font-medium">Last updated: 18th May, 2025</p>

          <p className="mb-4">
            These terms explain how Lucafy is meant to be used. By creating an
            account and using the app, you agree to the following:
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the App</h2>
          <p className="mb-4">
            Lucafy is free to use for personal accounting purposes. You&apos;re
            welcome to use it to track your finances, download your data, and
            explore the features.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. User Data</h2>
          <p className="mb-4">
            To sign up, you&apos;ll need to provide your first name, last name,
            email, and a password. Your financial entries are stored in a secure
            database. You remain the owner of your data and can download or
            delete it at any time.
          </p>
          <p className="mb-4">
            Deleting your account permanently removes <strong>all data</strong>{" "}
            linked to you.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. No Guarantees</h2>
          <p className="mb-4">
            Lucafy is a hobby project. It&apos;s provided &quot;as is&quot; with
            no guarantees about uptime, data integrity, or financial accuracy.
            Use it at your own discretion. Always keep a backup of important
            financial records.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. Intellectual Property
          </h2>
          <p className="mb-4">
            The source code is open-source and publicly available on GitHub.
            You&apos;re free to use or contribute to it under the project&apos;s
            license (
            <span className="italic">
              add your license type here, e.g., MIT
            </span>
            ).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            5. Changes to Terms
          </h2>
          <p className="mb-4">
            These terms might change in the future. We&apos;ll post updates
            here. By continuing to use the app, you&apos;re accepting the latest
            version.
          </p>
        </section>
      </main>
    </div>
  );
}
