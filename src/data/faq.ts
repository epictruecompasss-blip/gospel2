export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    category: 'About the Devotional',
    items: [
      {
        q: 'What exactly is In Him Daily?',
        a: 'In Him Daily is a daily devotional series designed to bring three generations of a family face to face with Jesus Christ — simultaneously, every day, each in language and depth appropriate for their age. The series spans three series tracing Christ through His names, His Gospel encounters, and His Old Testament appearances. Each day is available in three editions: Adult, Teen (ages 13–18), and Children\u2019s (ages 5–12). Same encounter. Same Jesus. Three conversations.',
      },
      {
        q: 'How long does each daily devotional take to read?',
        a: 'Each daily devotional is designed for a 10 to 15 minute reading. It contains a key verse, the main teaching (6 to 8 paragraphs of substantive biblical content), an application or reflection section, three reflection questions, a written prayer, and a daily confession designed to be spoken aloud three times across the day. For families with young children, the Children\u2019s Edition takes 8 to 10 minutes when read aloud together.',
      },
      {
        q: 'Is In Him Daily theologically sound? What tradition does it come from?',
        a: 'In Him Daily is rooted in the historic, orthodox Christian faith as expressed in the Nicene Creed and the great tradition of biblical scholarship. It is not aligned with any single denomination but draws deeply from the theological heritage of the church across the centuries — including the early church fathers, the Reformation, and the contemporary evangelical tradition. It holds firmly to the full authority of Scripture, the deity of Christ, the substitutionary atonement, the bodily resurrection, and the person and work of the Holy Spirit. It is suitable for families from a wide range of Christian traditions.',
      },
      {
        q: 'What makes In Him Daily different from other daily devotionals like Jesus Calling or My Utmost for His Highest?',
        a: 'Three things make In Him Daily distinctive. First, the three-generation design: no other daily devotional series currently available is written simultaneously for adults, teenagers, and children covering the same encounter with Jesus every day. Second, the depth: In Him Daily treats every reader as an intelligent adult (or teenager, or child) who can handle genuine biblical and theological substance — it is not a collection of inspirational thoughts but a real daily encounter with the living Jesus of the Gospels. Third, the family connection: In Him Daily is designed to produce a conversation at the dinner table — three generations who have read the same encounter from three different books, with something to say to each other about it.',
      },
      {
        q: 'Can I use In Him Daily if I am not a parent? Is it only for families?',
        a: 'Absolutely. In Him Daily is for anyone who wants a daily encounter with Jesus that is theologically grounded and personally transforming. The three-generation design is the distinctive of the series — but every edition stands completely on its own. The Adult Edition is a full, rich, daily encounter with Scripture that has been used by individuals, small groups, and churches as a personal or corporate devotional. Many users purchase only the Adult Edition and find it completely satisfying as a standalone daily practice.',
      },
    ],
  },
  {
    category: 'The Three-Generation Design',
    items: [
      {
        q: 'How does the three-generation design work in practice?',
        a: 'Each day, the same biblical encounter is written in three separate editions — Adult, Teen, and Children\u2019s — each one appropriate for its specific age group in language, depth, and application. A parent reads the Adult Edition in the morning. The teenager reads the Teen Edition during the day. The child reads the Children\u2019s Edition, ideally with a parent reading aloud. In the evening, the family has a natural conversation point: \u2018what did you get from today\u2019s story about Jesus?\u2019 Each person has engaged with the same encounter at their own level, so the conversation is accessible to everyone at the table.',
      },
      {
        q: 'What if only one person in my family is interested? Do I need all three editions?',
        a: 'No. Each edition is completely self-contained and does not require the others to be meaningful. Many families start with one edition — often the Adult Edition — and find that as the Word begins to work in the home, other family members become interested and the additional editions are added naturally. You do not need all three to begin. Begin with where you are and let the Word do the rest.',
      },
      {
        q: 'What age is the Children\u2019s Edition written for?',
        a: 'The Children\u2019s Edition is written for children aged 5 to 12. The content is accessible to confident readers aged 8 and above, and is designed to be read aloud by a parent or caregiver with younger children. The daily devotional includes the main story, a Did You Know? fact section, three discussion questions for family conversation, a short prayer, and a daily confession. The confession is designed to be short enough for a young child to memorise and meaningful enough to carry through the day.',
      },
      {
        q: 'My teenager says devotionals are boring. Is the Teen Edition really written differently?',
        a: 'Yes — genuinely, not just in font size. The Teen Edition is written in direct, honest language that respects the teenager\u2019s intelligence and takes their questions seriously. It does not filter for comfort or simplify to the point of condescension. It acknowledges that teenagers are the generation most at risk of walking away from faith and it speaks to them accordingly — with depth, with honesty, and with the full, unfiltered Jesus of the Gospels rather than a polished, unoffending version. Each day includes a Something to Sit With section designed to produce genuine thinking rather than correct-answer performance. Many parents have reported that their teenagers found the Teen Edition more engaging than any devotional they had previously tried.',
      },
    ],
  },
  {
    category: 'Access and Purchasing',
    items: [
      {
        q: 'Where can I get In Him Daily?',
        a: 'The complete series is available at inhimdaily.org. You can download the free 7-day sample immediately from the homepage to try all three editions before purchasing. All three series are available as digital downloads, with physical editions coming soon. For church or institutional licensing — if you would like to use In Him Daily as the family discipleship curriculum for your church or school — please contact us directly through the website.',
      },
      {
        q: 'How much do the devotionals cost?',
        a: 'Each series is available in three editions: Kids ($8), Teen ($10), and Adult ($12). The Complete Family Bundle — all three editions of a series — is $25. Bulk discounts are available for churches and schools: 20% off for 5–20 bundles, 30% off for 21–50, and 40% off for 51+. All prices are listed in USD, with local currency equivalents available for Kenya, Nigeria, Ghana, South Africa, Uganda, and Tanzania.',
      },
      {
        q: 'Is there a digital version I can access on my phone or tablet?',
        a: 'Yes. In Him Daily is available as a digital download that can be read on any device — phone, tablet, laptop, or desktop. A dedicated app is in development for an even more seamless daily experience. In the meantime, the PDF digital edition is fully formatted for screen reading and can be downloaded immediately after purchase.',
      },
      {
        q: 'Are physical books available?',
        a: 'Physical editions of all three series are coming soon. In the meantime, the digital PDF editions are fully formatted for both screen reading and home printing. Sign up for our newsletter at inhimdaily.org to be notified when physical books become available.',
      },
      {
        q: 'Can our church or school use In Him Daily as a group curriculum?',
        a: 'Absolutely — and this is one of In Him Daily\u2019s most powerful use cases. The series is ideal as a church family discipleship curriculum, a Christian school Bible class resource, or a small group study guide. Institutional licensing is available for churches and schools that want to equip their families with the full three-edition set. Please contact us through the website for licensing options, bulk pricing, and curriculum support materials.',
      },
    ],
  },
  {
    category: 'The Free Sample',
    items: [
      {
        q: 'What is included in the free 7-day sample?',
        a: 'The free 7-day sample includes the first seven complete daily devotionals in all three editions — Adult, Teen, and Children\u2019s. That is 21 complete devotional documents, each one a full daily encounter with Jesus. The seven days cover: The Word Became Flesh, The Baptism of Jesus, The First Disciples (Come and See), Water into Wine, Nicodemus by Night, John 3:16, and He Revealed His Glory. Each edition also includes a cover page, an about section, and a back page with the full series overview.',
      },
      {
        q: 'Is the free sample really free? Do I need to give my credit card?',
        a: 'Yes, completely free. No credit card required. You provide your email address, the sample is delivered to your inbox immediately, and you are under no obligation to purchase anything. We send the sample because we believe that if you spend seven days encountering Jesus through In Him Daily, you will want to continue. The seven days do the persuading — we do not need to.',
      },
      {
        q: 'What happens after the 7-day sample? Am I automatically subscribed or charged?',
        a: 'Nothing automatic happens. After Day 7, you will receive an email with information about the complete series and how to access it. If you choose to purchase, that is your decision and requires your deliberate action. You will not be charged automatically. You will not be spammed. We will send you occasional updates about new content, new volumes, and resources from In Him Daily — from which you can unsubscribe at any time.',
      },
    ],
  },
  {
    category: 'About the Ministry',
    items: [
      {
        q: 'Who is behind In Him Daily?',
        a: 'In Him Daily is a ministry of Epic True North, based in Nairobi, Kenya. The series was written by a former minister with a deep commitment to the New Covenant revelation of Jesus Christ and the restoration of the family altar in the Christian home. The author brings years of pastoral experience, biblical scholarship, and a daily practice of prayer to every word written. In Him Daily is not a publishing project. It is a ministry — born in the secret place, sustained by prayer, and offered to the body of Christ as an instrument for generational transformation.',
      },
      {
        q: 'What is the theological foundation of In Him Daily?',
        a: 'In Him Daily is built on John 1:14: the Word became flesh and made His dwelling among us, full of grace and truth. Every devotional in the series is an encounter with that fullness — both the grace that receives and transforms, and the truth that challenges and renews. The series does not choose between theological depth and spiritual warmth. It insists on both simultaneously. The theological method is exegetical — rooted in the actual text of Scripture — and the pastoral posture is one of genuine encounter rather than religious performance.',
      },
      {
        q: 'Is In Him Daily only for African families, or is it for everyone?',
        a: 'In Him Daily is for every family in every nation that hungers for a daily encounter with Jesus. It was born in Kenya, it carries the warmth and directness of the African church\u2019s relationship with Scripture, and it is offered to the global body of Christ. The three-generation design is universal — every culture has parents, teenagers, and children. The Jesus encountered in these devotionals is the Jesus of the Gospels — and the Jesus of the Gospels has no borders.',
      },
      {
        q: 'How can I stay connected with In Him Daily beyond the devotionals?',
        a: 'The best way to stay connected is to subscribe to the In Him Daily community through the website. Subscribers receive updates about new volumes and series, resources for family devotional life, and occasional reflections from the author on living the Word in the daily rhythms of family and faith. You can also join our WhatsApp communities for adults, teens, and families, and follow In Him Daily on social media — links are available at inhimdaily.org. If you have a testimony about how In Him Daily has impacted your family, we would love to hear it — testimonies fuel the mission and we read every one.',
      },
    ],
  },
];
