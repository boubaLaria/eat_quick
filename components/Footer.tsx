const opening = [
  { day: "Sunday", time: "closed" },
  { day: "Monday", time: "closed" },
  { day: "Tuesday", time: "10am to 3pm" },
  { day: "Wednesday", time: "10am to 3pm - 7pm to 10pm" },
  { day: "Thursday", time: "10am to 3pm" },
  { day: "Friday", time: "10am to 3pm" },
  { day: "Saturday", time: "10am to 3pm - 7pm to 10pm" },
];

export default async function Footer() {
  "use cache";
  return (
    <footer className="bg-green-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3 font-display">Opening Hours</h3>
          <ul className="space-y-1 text-sm">
            {opening.map(({ day, time }) => (
              <li key={day} className="flex justify-between gap-4">
                <span className="font-medium w-28">{day}</span>
                <span
                  className={
                    time === "closed" ? "text-red-300 italic" : "text-green-200"
                  }
                >
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3 font-display">EatQuick</h3>
          <p className="text-sm text-green-200">
            Fresh salads &amp; hot meals, made with love.
          </p>
          <p className="text-sm text-green-200 mt-1">
            123 Green Street, Paris
          </p>
          <p className="text-sm text-green-200 mt-1">
            contact@eatquick.fr
          </p>
        </div>
      </div>
      <div className="border-t border-green-700 text-center py-3 text-xs text-green-400">
        © {new Date().getFullYear()} EatQuick — All rights reserved
      </div>
    </footer>
  );
}
