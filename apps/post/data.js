    const themes = {
      christmas: 'Christmas & New Year\'s',
      birthday: 'Birthday',
      wedding: 'Wedding & Anniversary',
      graduation: 'Graduation',
      thankyou: 'Thank You'
    };
    const phrases = {
      christmas: [
        { heading: 'Merry Christmas', subheading: '& Happy New Year' },
        { heading: 'Season\'s Greetings', subheading: 'Wishing You Joy' },
        { heading: 'Happy Holidays', subheading: 'From Our Family to Yours' },
        { heading: 'Warm Wishes', subheading: 'For a Magical Season' },
        { heading: 'Joyeux Noël', subheading: 'Et Bonne Année' }
      ],
      birthday: [
        { heading: 'Happy Birthday', subheading: 'Make a Wish!' },
        { heading: 'Celebrate You', subheading: 'Another Year of Awesome' },
        { heading: 'Best Day Ever', subheading: 'It\'s Your Birthday!' },
        { heading: 'Cheers to You', subheading: 'On Your Special Day' },
        { heading: 'Birthday Wishes', subheading: 'Hope It\'s Amazing' }
      ],
      wedding: [
        { heading: 'Congratulations', subheading: 'On Your Wedding Day' },
        { heading: 'Happy Anniversary', subheading: 'Celebrating Your Love' },
        { heading: 'Forever Together', subheading: 'Wishing You Happiness' },
        { heading: 'Love & Laughter', subheading: 'Today and Always' },
        { heading: 'Just Married', subheading: 'Best Wishes for Your Journey' }
      ],
      graduation: [
        { heading: 'Congratulations', subheading: 'Celebrating Your Achievement' },
        { heading: 'You Did It!', subheading: 'Proud of Your Achievement' },
        { heading: 'Dream Big', subheading: 'The Future is Yours' },
        { heading: 'Well Done', subheading: 'Celebrating Your Success' },
        { heading: 'New Beginnings', subheading: 'Ready for the Next Chapter' }
      ],
      thankyou: [
        { heading: 'Thank You', subheading: 'For Everything' },
        { heading: 'Much Appreciated', subheading: 'Your Kindness Means a Lot' },
        { heading: 'Grateful', subheading: 'For Your Support' },
        { heading: 'Many Thanks', subheading: 'You\'re Wonderful' },
        { heading: 'With Gratitude', subheading: 'From the Heart' }
      ]
    };
    const themeColorDefaults = {
      christmas: {primary: '#496d68', secondary: '#bac5cd', text: '#fff9ef'},
      birthday: {primary: '#a7bdcf', secondary: '#b9828c', text: '#344854'},
      wedding: {primary: '#fff9ef', secondary: '#806127'},
      graduation: {primary: '#4a535f', secondary: '#c4ccd5', text: '#fff9ef'},
      thankyou: {primary: '#c0cabc', secondary: '#68757b', text: '#3d5046'}
    };

// Occasion templates override the shared typography defaults in app.js.
const themeStyleDefaults = {
  christmas: {message: 'Wishing you joy and happiness this holiday season!', border: 'classic'},
  birthday: {message: 'Wishing you a wonderful birthday filled with laughter, love, and all your favorite things!', headingFont: 'Fredoka', accentFinish: 'metallic', border: 'wavy', effect: 'none'},
  wedding: {message: 'Wishing you a lifetime of love, laughter, and wonderful memories together.', accentFinish: 'metallic', headingFont: 'Palatino', headingItalic: true, headingBold: false, border: 'classic', effect: 'glow'},
  graduation: {message: 'Congratulations on all your hard work! Wishing you every success in your next adventure.', accentFinish: 'metallic', headingFont: 'Palatino', subheadingFont: 'Fredoka', border: 'thick'},
  thankyou: {message: 'Your kindness means so much. Thank you for making a difference!', headingFont: 'Palatino', border: 'dotted'}
};
