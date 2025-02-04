export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-blue-900">
            Welcome <br />
            <strong>Dash</strong>
          </h2>
          <span className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-indigo-800">
            01:51
          </span>
        </div>

        <div className="flex-1 bg-blue-100 border border-blue-200 rounded-xl p-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl text-blue-900">
            Inbox <br />
            <strong>23</strong>
          </h2>
          <a
            href="#"
            className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-blue-800 hover:bg-blue-900 transition-transform duration-300 hover:scale-105"
          >
            See messages
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 h-64">
          <h3 className="text-xl font-bold text-indigo-800">Stats Card 1</h3>
        </div>
        <div className="bg-white rounded-xl p-6 h-64">
          <h3 className="text-xl font-bold text-indigo-800">Stats Card 2</h3>
        </div>
        <div className="bg-white rounded-xl p-6 h-64">
          <h3 className="text-xl font-bold text-indigo-800">Stats Card 3</h3>
        </div>
      </div>
    </>
  );
}
