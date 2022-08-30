export default function Settings() {
  return (
    <>
      <div className="w-full max-w-sm sm:mt-4 mb-8">
        <h1 className="text-4xl font-bold text-left">Settings</h1>
      </div>

      <div className="card w-full max-w-sm bg-base-100 mb-8">
        <div className="card-body sm:w-96 w-full">
          <div className="card-title">
            <h1 className="text-2xl font-bold">Preference</h1>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Currency Format</span>
            </label>
            <select className="select select-bordered">
              <option value="ind">Indian</option>
              <option value="int">International</option>
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Currency Name</span>
            </label>
            <select className="select select-bordered">
              <option value="₹">Rupee (₹) 🇮🇳</option>
              <option value="$">Dollar ($) 🇺🇸 🇦🇺 🇨🇦 🇲🇽</option>
              <option value="€">Euro (€) 🇪🇺</option>
              <option value="₦">Naira (₦) 🇳🇬</option>
              <option value="₪">New Shekel (₪) 🇮🇱</option>
              <option value="£">Pound (£) 🇬🇧</option>
              <option value="₽">Ruble (₽) 🇷🇺</option>
              <option value="৳">Taka (৳) 🇧🇩</option>
              <option value="₩">Won (₩) 🇰🇷</option>
              <option value="¥">Yen (¥) 🇯🇵 🇨🇳</option>
            </select>
          </div>
          <div className="form-control mt-4">
            <button className="btn bg-green-500 text-white">Save</button>
          </div>
        </div>
      </div>

      <div className="card w-full max-w-sm bg-base-100 mb-8">
        <div className="card-body sm:w-96 w-full">
          <div className="card-title">
            <h1 className="text-2xl font-bold">Delete Account</h1>
          </div>

          <p className="text-justify text-xs mt-2">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam id
            praesentium laudantium ratione vel necessitatibus distinctio, quas
            error suscipit rerum eaque accusantium dolorum, sint, consequuntur
            obcaecati mollitia amet quae. Cum?
          </p>
          <button className="btn bg-red-500 text-white w-full mt-4">
            Delete
          </button>
        </div>
      </div>

      <div className="card w-full max-w-sm bg-base-100 mb-8">
        <div className="card-body sm:w-96 w-full">
          <div className="card-title">
            <h1 className="text-2xl font-bold">Normalization</h1>
          </div>

          <p className="text-justify text-xs mt-2">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam id
            praesentium laudantium ratione vel necessitatibus distinctio, quas
            error suscipit rerum eaque accusantium dolorum, sint, consequuntur
            obcaecati mollitia amet quae. Cum?
          </p>
          <button className="btn bg-yellow-500 text-white w-full mt-4">
            Normalize
          </button>
        </div>
      </div>
    </>
  );
}
