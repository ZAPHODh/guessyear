export default {
  title: "How to Play",
  subtitle: "Learn how to master the daily image guessing game!",
  objective: {
    title: "Objective",
    description: "Guess the year when a historical photograph was taken. You have 5 attempts to get it right!"
  },
  howItWorks: {
    title: "How It Works",
    step1: "Look at the historical photograph carefully for clues about the time period.",
    step2: "Enter your guess for the year the photo was taken.",
    step3: "Get feedback: 'Higher' if the actual year is later, 'Lower' if it's earlier.",
    step4: "Use the feedback to narrow down your next guess. The valid range will automatically adjust!"
  },
  smartRange: {
    title: "Smart Range System",
    description: "After each guess, the game intelligently narrows down the possible years to help you:",
    example: {
      title: "Example",
      step1: "You guess 1950, answer is 'Higher' → New range: 1951-2025",
      step2: "You guess 1980, answer is 'Lower' → New range: 1951-1979", 
      step3: "You guess 1965, answer is 'Correct!' → You win!"
    }
  },
  tips: {
    title: "Pro Tips",
    tip1: "Look for clothing styles, architecture, cars, and technology in the photo",
    tip2: "Start with a middle-range guess to quickly narrow down the possibilities",
    tip3: "Pay attention to photo quality - older photos tend to be black & white or sepia"
  }
} as const