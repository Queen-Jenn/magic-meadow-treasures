const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSXkS2a4fZCKfug0MvY9GN8acpmf3GbxenpZH_KE7_hLzmgSuj0_ZWhlHmT1whjQytJuBUms8YBEzTx/pub?gid=0&single=true&output=csv";

const searchMessages = [
    "Bunny is searching beneath the clover...",
    "Checking the wildflower patch...",
    "Looking near the old stone wall...",
    "Following a trail of dandelion fluff...",
    "Consulting the Meadow Council...",
    "Searching near the carrot patch..."
];

const bunnyComments = [
    "A lovely treasure today.",
    "The meadow approves.",
    "Something wonderful awaits.",
    "Bunny worked very hard for this.",
    "An excellent discovery."
];

function parseCSV(text){

    const lines = text.trim().split("\n");

    const headers = lines[0]
        .split(",")
        .map(h => h.trim());

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const obj = {};

        headers.forEach((header,index)=>{

            obj[header] =
                values[index]?.trim() || "";

        });

        return obj;

    });

}

function weightedPick(items){

    const total =
        items.reduce(
            (sum,item)=>
            sum + Number(item.Weight || 1),
            0
        );

    let random =
        Math.random() * total;

    for(const item of items){

        random -= Number(item.Weight || 1);

        if(random <= 0){

            return item;

        }

    }

    return items[0];

}

async function discoverTreasure(){

    document
        .getElementById("rewardCard")
        .classList
        .add("hidden");

    document
        .getElementById("searchMessage")
        .textContent =
            searchMessages[
                Math.floor(
                    Math.random() *
                    searchMessages.length
                )
            ];

    const response =
        await fetch(CSV_URL);

    const csv =
        await response.text();

    const rewards =
        parseCSV(csv)
        .filter(
            row =>
            row.Active.toUpperCase()
            === "TRUE"
        );

    const reward =
        weightedPick(rewards);

    setTimeout(()=>{

        document
            .getElementById("rewardEmoji")
            .textContent =
                reward.Emoji || "🌼";

        document
            .getElementById("rewardTitle")
            .textContent =
                reward.Reward;

        document
            .getElementById("rewardMessage")
            .textContent =
                reward.Message ||
                "The meadow has chosen a treasure for you.";

        document
            .getElementById("bunnyComment")
            .textContent =
                "🐰 " +
                bunnyComments[
                    Math.floor(
                        Math.random() *
                        bunnyComments.length
                    )
                ];

        document
            .getElementById("rewardCard")
            .classList
            .remove("hidden");

    },2500);

}

let visits =
    Number(
        localStorage.getItem(
            "meadowVisits"
        ) || 0
    );

visits++;

localStorage.setItem(
    "meadowVisits",
    visits
);

document
    .getElementById("visitCount")
    .textContent =
        visits;

document
    .getElementById("discoverBtn")
    .addEventListener(
        "click",
        discoverTreasure
    );

discoverTreasure();
