export const metadata = {
  title: "Opening Hours — EatQuick",
};

const opening = [
  { day: "Sunday", time: "closed" },
  { day: "Monday", time: "closed" },
  { day: "Tuesday", time: "10am to 3pm" },
  { day: "Wednesday", time: "10am to 3pm - 7pm to 10pm" },
  { day: "Thursday", time: "10am to 3pm" },
  { day: "Friday", time: "10am to 3pm" },
  { day: "Saturday", time: "10am to 3pm - 7pm to 10pm" },
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = days[new Date().getDay()];

export default function OpeningTimePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="mb-2">Opening Hours</h1>
      <p className="text-stone-500 mb-10">Visit us at 123 Green Street, Paris</p>

      <div className="card divide-y divide-stone-100">
        {opening.map(({ day, time }) => {
          const isToday = day === today;
          const isClosed = time === "closed";
          return (
            <div
              key={day}
              className={`flex justify-between items-center px-6 py-4 ${
                isToday ? "bg-green-50" : ""
              }`}
            >
              <span className={`font-medium ${isToday ? "text-green-800" : "text-stone-700"}`}>
                {day}
                {isToday && (
                  <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </span>
              <span
                className={`text-sm ${
                  isClosed
                    ? "text-red-400 italic"
                    : "text-green-700 font-semibold"
                }`}
              >
                {time}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-stone-500 text-sm">
        Last orders taken 15 minutes before closing time.
      </p>
    </div>
  );
}
