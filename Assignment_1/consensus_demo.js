import crypto from "crypto";

function simulatePoW() {
  
    const miners = [
    {
      name: "Miner A",
      power: Math.floor(Math.random() * 100),
    },
    {
      name: "Miner B",
      power: Math.floor(Math.random() * 100),
    },
    {
      name: "Miner C",
      power: Math.floor(Math.random() * 100),
    },
  ];

  let winner = miners[0];

  for (let i = 1; i < miners.length; i++) {
    if (miners[i].power > winner.power) {
      winner = miners[i];
    }
  }

  console.log("=== Proof of Work ===");
  console.log("Miners:", miners);
  console.log(`Winner: ${winner.name} with power ${winner.power}`);
  console.log(
    "Explanation: PoW selects the validator with the highest computational power.\n"
  );
}

function simulatePoS() {
 
    const stakers = [
    {
      name: "Staker 1",
      stake: Math.floor(Math.random() * 1000),
    },
    {
      name: "Staker 2",
      stake: Math.floor(Math.random() * 1000),
    },
    {
      name: "Staker 3",
      stake: Math.floor(Math.random() * 1000),
    },
  ];

  let winner = stakers[0];

  for (let i = 1; i < stakers.length; i++) {
    if (stakers[i].stake > winner.stake) {
      winner = stakers[i];
    }
  }

  console.log("=== Proof of Stake ===");
  console.log("Stakers:", stakers);
  console.log(`Winner: ${winner.name} with power ${winner.stake}`);
  console.log(
    "Explanation: PoS selects the validator with the highest cryptocurrency stake.\n"
  );
}

function simulateDPoS() {
  
  const delegates = ["Delegate A", "Delegate B", "Delegate C"];
  const voters = [
    {
      name: "Voter 1",
      vote: delegates[Math.floor(Math.random() * delegates.length)],
    },
    {
      name: "Voter 2",
      vote: delegates[Math.floor(Math.random() * delegates.length)],
    },
    {
      name: "Voter 3",
      vote: delegates[Math.floor(Math.random() * delegates.length)],
    },
  ];

  const voteCounts = {};
  voters.forEach((v) => {
    voteCounts[v.vote] = (voteCounts[v.vote] || 0) + 1;
  });

  const winner = Object.entries(voteCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );

  console.log("=== Delegated Proof of Stake ===");
  console.log("Votes:", voters);
  console.log(`Winner: ${winner[0]} with ${winner[1]} votes`);
  console.log(
    "Explanation: DPoS selects a delegate based on votes from token holders.\n"
  );
}

simulatePoW();
simulatePoS();
simulateDPoS();
