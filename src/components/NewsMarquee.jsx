
const NewsMarquee = () => {
  const newsItems = [
    "No decision from EU drug regulator yet on Wegovy label expansion",
    "Theon Pharmaceutical launches Linagliptin + Dapagliflozin + Metformin Hydroc",
    "USFDA gives a nod to Lupin for smoking cessation drug Chantix",
    "Zydus gets USFDA final approval for Ivabradine tablets, 5 mg and 7.5 mg",
    "Aurobindo Pharma gets USFDA nod for HIV drug",
    "Prices of 800 essential drugs to increase a tad from April 1",
    "Pharmaceutical bodies welcome uniform marketing code",
    "Indian Immunologicals Ltd commemorates 25 yrs of Human Biologicals Institute"
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
      <h3 className="text-emerald-400 font-semibold mb-2 text-sm">Medicine Updates</h3>
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {newsItems.map((item, index) => (
            <span key={index} className="text-slate-300 text-sm">
              {item} • {" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsMarquee;
