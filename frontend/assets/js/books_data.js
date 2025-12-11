/* Season id: 1 = winter, 2 = spring, 3 = summer, 4 = autumn */
const books = [
  {
    id: 1,
    season_id: 1,
    title: 'The Book Eaters',
    author: 'Sunyi Dean',
    description: 'An unusual sci-fi story about a book eater woman who tries desperately to save her\n' +
      '          dangerous mind-eater son from tradition and certain death&#46; Complete with dysfunctional family values&#44;\n' +
      '          light\n' +
      '          Sapphic romance&#44; and a strong&#44; complex protagonist&#46; Not for the faint of heart&#46;',
    cover: 'assets/img/favorites-img/dean.png',
  },
  {
    id: 2,
    season_id: 1,
    title: 'Cackle',
    author: 'Rachel Harrison',
    description: 'Are your Halloween movies of choice The Witches of Eastwick and Practical Magic?\n' +
      '          Look no further than here - where a woman recovering from a breakup moves to a quaint town in upstate New York\n' +
      '          and\n' +
      '          befriends a beautiful witch&#46;',
    cover: 'assets/img/favorites-img/harrison.png',
  },
  {
    id: 3,
    season_id: 1,
    title: 'Dante&#58; Poet of the Secular World',
    author: 'Erich Auerbach',
    description: 'Auerbach&#39;s engaging book places the &#8216;Comedy&#8217; within the tradition\n' +
      '          of\n' +
      '          epic&#44;\n' +
      '          tragedy&#44;\n' +
      '          and philosophy in general&#44; arguing for Dante\'s uniqueness as one who raised the individual and his drama\n' +
      '          of\n' +
      '          soul into something of divine significance&#8212;an inspired introduction to Dante\'s main themes&#46;',
    cover: 'assets/img/favorites-img/auerbach.png',
  },
  {
    id: 4,
    season_id: 1,
    title: 'The Last Queen',
    author: 'Clive Irving',
    description: 'A timely and revelatory new biography of Queen Elizabeth (and her family) exploring\n' +
      '          how the Windsors have evolved and thrived as the modern world has changed around them&#46;',
    cover: 'assets/img/favorites-img/irving.png',
  },
  {
    id: 5,
    season_id: 2,
    title: 'The Body',
    author: 'Stephen King',
    description: 'Powerful novel that takes you back to a nostalgic time&#44; exploring both the\n' +
      '          beauty\n' +
      '          and danger and loss of innocence that is youth&#46;',
    cover: 'assets/img/favorites-img/king.png',
  },
  {
    id: 6,
    season_id: 2,
    title: 'Carry&#58; A Memoir of Survival on Stolen Land',
    author: 'Toni Jenson',
    description: 'This memoir about the author&#39;s relationship with gun violence feels both\n' +
      '          expansive\n' +
      '          and intimate&#44; resulting in a lyrical indictment of the way things are&#46;',
    cover: 'assets/img/favorites-img/jenson.png',
  },
  {
    id: 7,
    season_id: 2,
    title: 'Days of Distraction',
    author: 'Alexandra Chang',
    description: 'A sardonic view of Silicon Valley culture&#44; a meditation on race&#44; and a\n' +
      '          journal of\n' +
      '          displacement and belonging&#44; all in one form-defying package of spare prose&#46;',
    cover: 'assets/img/favorites-img/chang.png',
  },
  {
    id: 8,
    season_id: 2,
    title: 'Dominicana',
    author: 'Angie Cruz',
    description: 'A fascinating story of a teenage girl who marries a man twice her age with the\n' +
      '          promise to bring her to America&#46; Her marriage is an opportunity for her family to eventually immigrate&#46;\n' +
      '          For\n' +
      '          fans of Isabel Allende and Julia Alvarez&#46;',
    cover: 'assets/img/favorites-img/cruz.png',
  },
  {
    id: 9,
    season_id: 3,
    title: 'Crude&#58; A Memoir',
    author: 'Pablo Fajardo &#38; Sophie Tardy-Joubert',
    description: 'Drawing and color by Damien Roudeau &#124; This book illustrates the struggles of a\n' +
      '          group of indigenous Ecuadoreans as they try to sue the ChevronTexaco company for damage their oil fields did\n' +
      '          to the Amazon and her people',
    cover: 'assets/img/favorites-img/fajardo.png',
  },
  {
    id: 10,
    season_id: 3,
    title: 'Let My People Go Surfing',
    author: 'Yvon Chouinard',
    description: 'Chouinard&#8212;climber&#44; businessman&#44; environmentalist&#8212;shares tales\n' +
      '          of\n' +
      '          courage\n' +
      '          and persistence from his experience of founding and leading Patagonia&#44; Inc&#46; Full title&#58; Let My\n' +
      '          People Go\n' +
      '          Surfing&#58; The Education of a Reluctant Businessman&#44; Including 10 More Years of Business\n' +
      '          Unusual&#46;',
    cover: 'assets/img/favorites-img/chouinard.png',
  },
  {
    id: 11,
    season_id: 3,
    title: 'The Octopus Museum&#58; Poems',
    author: 'Brenda Shaughnessy',
    description: 'This collection of bold and scathingly beautiful feminist poems imagines what comes\n' +
      '          after our current age of environmental destruction&#44; racism&#44; sexism&#44; and divisive politics&#46;',
    cover: 'assets/img/favorites-img/shaughnessy.png',
  },
  {
    id: 12,
    season_id: 3,
    title: 'Shark Dialogues&#58; A Novel',
    author: 'Kiana Davenport',
    description: 'An epic saga of seven generations of one family encompasses the tumultuous history\n' +
      '          of Hawaii as a Hawaiian woman gathers her four granddaughters together in an erotic tale of villains and\n' +
      '          dreamers&#44; queens and revolutionaries&#44; lepers and healers&#46;',
    cover: 'assets/img/favorites-img/davenport.png',
  },
  {
    id: 13,
    season_id: 4,
    title: 'Casual Conversation',
    author: 'Renia White',
    description: 'White&#39;s impressive debut collection takes readers through and beyond the\n' +
      '          concepts of conversation and the casual - both what we say to each other and what we don\'t&#44; examining the\n' +
      '          possibilities around how we construct and communicate identity&#46;',
    cover: 'assets/img/favorites-img/white.png',
  },
  {
    id: 14,
    season_id: 4,
    title: 'The Great Fire',
    author: 'Lou Ureneck',
    description: 'The harrowing story of an ordinary American and a principled Naval officer who&#44;\n' +
      '          horrified by the burning of Smyrna&#44; led an extraordinary rescue effort that saved a quarter of a million\n' +
      '          refugees from the Armenian Genocide',
    cover: 'assets/img/favorites-img/ureneck.png',
  },
  {
    id: 15,
    season_id: 4,
    title: 'Rickey&#58; The Life and Legend',
    author: 'Howard Bryant',
    description: '>With the fall rolling around&#44; one can&#39;t help but think of baseball&#39;s\n' +
      '          postseason\n' +
      '          coming up! And what better way to prepare for it than reading the biography of one of the game&#39;s\n' +
      '          all-time\n' +
      '          greatest performers&#44; the Man of Steal&#44; Rickey Henderson?',
    cover: 'assets/img/favorites-img/bryant.png',
  },
  {
    id: 16,
    season_id: 4,
    title: 'Slug&#58; And Other Stories',
    author: 'Megan Milks',
    description: 'Exes Tegan and Sara find themselves chained together by hairballs of codependency&#46;\n' +
      '          A father and child experience the shared trauma of giving birth to gods from their wounds&#46;',
    cover: 'assets/img/favorites-img/milks.png',
  },
]
