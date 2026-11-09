/* =========================================================
   XALAM — Données de l'application
   Tout le contenu (artistes, titres, genres) est ici.
   Photos d'artistes : images/artistes/ (champ photo)
   Pochettes : images/pochettes/ (champ cover d'un titre ou d'un album).
   Sans image, un dégradé à motif wax s'affiche à la place.
   ========================================================= */

// Couleurs des pochettes (dégradés), reprises de la maquette Figma
const PALETTES = [
  ["#C8553D", "#7A2E21"], ["#E9A23B", "#B5651D"], ["#2D6A4F", "#1B4332"],
  ["#E07A5F", "#C8553D"], ["#3A5A40", "#16302A"], ["#B5651D", "#5C2A14"],
  ["#81B29A", "#2D6A4F"], ["#F2CC8F", "#E07A5F"]
];

const GENRES = [
  { name: "Mbalax", color: 0, artists: 40 },
  { name: "Rap Galsen", color: 2, artists: 66 },
  { name: "Afro-jazz", color: 4, artists: 92 },
  { name: "Acoustique", color: 3, artists: 79 },
  { name: "Folk Peul", color: 7, artists: 31 },
  { name: "Afrobeats", color: 1, artists: 53 },
  { name: "Reggae", color: 6, artists: 18 },
  { name: "Sabar", color: 5, artists: 24 }
];

const REGIONS = ["Dakar", "Saint-Louis", "Thiès", "Ziguinchor", "Kaolack", "Diaspora"];

const ARTISTS = [
  { id: "youssou", name: "Youssou N’Dour", genre: "Mbalax", region: "Dakar", color: 0, photo: "images/artistes/youssou.jpg", verified: true,
    tagline: "Le roi du mbalax. Plus de 40 ans à faire voyager la musique sénégalaise dans le monde entier.",
    bio: "Né en 1959 à la Médina de Dakar, Youssou N’Dour a fait connaître le mbalax dans le monde entier. Grammy Award en 2005 pour l’album Egypt.",
    badge: "Grammy Award 2005",
    albums: [{ title: "Egypt", year: 2004, type: "Album", color: 0, cover: "images/pochettes/egypt.jpg" }, { title: "Rokku Mi Rokka", year: 2007, type: "Album", color: 1, cover: "images/pochettes/rokku-mi-rokka.jpg" }, { title: "Joko", year: 2000, type: "Album", color: 2, cover: "images/pochettes/joko.jpg" }] },
  { id: "daaraj", name: "Daara J", genre: "Rap Galsen", region: "Dakar", color: 1, photo: "images/artistes/daaraj.jpg", verified: true,
    bio: "Groupe de rap formé à Dakar dans les années 1990, l’un des pionniers du hip-hop sénégalais.", badge: "Pionniers du rap galsen" },
  { id: "baobab", name: "Orchestra Baobab", genre: "Afro-jazz", region: "Dakar", color: 2, photo: "images/artistes/baobab.jpg", verified: true,
    bio: "Orchestre fondé à Dakar en 1970, qui mêle rythmes afro-cubains et traditions sénégalaises.", badge: "Depuis 1970" },
  { id: "ismael", name: "Ismaël Lô", genre: "Acoustique", region: "Dakar", color: 3, photo: "images/artistes/ismael.jpg", verified: true,
    bio: "Auteur-compositeur, guitariste et harmoniciste, surnommé le « Bob Dylan africain ».", badge: "Guitare & harmonica" },
  { id: "baaba", name: "Baaba Maal", genre: "Folk Peul", region: "Saint-Louis", color: 7, photo: "images/artistes/baaba.jpg", verified: true,
    bio: "Chanteur originaire de Podor, ambassadeur de la musique pulaar du Fouta.", badge: "Voix du Fouta" },
  { id: "cheikhlo", name: "Cheikh Lô", genre: "Mbalax", region: "Diaspora", color: 5, photo: "images/artistes/cheikhlo.jpg", verified: true,
    bio: "Chanteur et percussionniste qui mêle mbalax et rythmes mandingues.", badge: "Chant & percussions" },
  { id: "wally", name: "Wally Seck", genre: "Mbalax", region: "Dakar", color: 2, photo: "images/artistes/wally.jpg", newgen: true,
    bio: "Fils de Thione Seck, l’une des figures du mbalax de la nouvelle génération.", badge: "Nouvelle génération" },
  { id: "dip", name: "Dip Doundou Guiss", genre: "Rap Galsen", region: "Dakar", color: 3, photo: "images/artistes/dip.jpg", newgen: true,
    bio: "Rappeur dakarois parmi les plus écoutés de la nouvelle scène.", badge: "Nouvelle génération" },
  { id: "ngaaka", name: "Ngaaka Blindé", genre: "Rap Galsen", region: "Dakar", color: 4, photo: "images/artistes/ngaaka.jpg", newgen: true,
    bio: "Rappeur connu pour ses textes en wolof et son flow percutant.", badge: "Nouvelle génération" },
  { id: "carlou", name: "Carlou D", genre: "Acoustique", region: "Dakar", color: 5, photo: "images/artistes/carlou.jpg", newgen: true,
    bio: "Chanteur et guitariste au style folk et afro-acoustique.", badge: "Nouvelle génération" }
];

/* Les fichiers audio sont des EXTRAITS DE DÉMO libres de droits
   (composés pour le projet). Remplace-les par tes propres MP3
   libres de droits en gardant le même nom ou en changeant "src". */
const TRACKS = [
  { id: "t1", title: "7 Seconds", artist: "youssou", feat: "Neneh Cherry", album: "The Guide (Wommat)", year: 1994, genre: "Mbalax", color: 0, src: "audio/7-seconds.mp3", cover: "images/pochettes/the-guide-wommat.jpg" },
  { id: "t2", title: "Boomerang", artist: "daaraj", album: "Boomerang", year: 2003, genre: "Rap Galsen", color: 1, src: "audio/boomerang.mp3", cover: "images/pochettes/boomerang.jpg" },
  { id: "t3", title: "Utrus Horas", artist: "baobab", album: "Pirates Choice", year: 1989, genre: "Afro-jazz", color: 2, src: "audio/utrus-horas.mp3", cover: "images/pochettes/pirates-choice.jpg" },
  { id: "t4", title: "Tajabone", artist: "ismael", album: "Ismaël Lô", year: 1990, genre: "Acoustique", color: 3, src: "audio/tajabone.mp3", cover: "images/pochettes/ismael-lo.jpg" },
  { id: "t5", title: "Swing Yela", artist: "baaba", album: "Firin' in Fouta", year: 1994, genre: "Folk Peul", color: 4, src: "audio/yela.mp3", cover: "images/pochettes/firin-in-fouta.jpg" },
  { id: "t6", title: "Ne La Thiass", artist: "cheikhlo", album: "Ne La Thiass", year: 1996, genre: "Mbalax", color: 5, src: "audio/ne-la-thiass.mp3", cover: "images/pochettes/ne-la-thiass.jpg" },
  { id: "t7", title: "Birima", artist: "youssou", album: "Joko", year: 2000, genre: "Mbalax", color: 1, src: "audio/ne-la-thiass.mp3", cover: "images/pochettes/birima.jpg" },
  { id: "t8", title: "Set", artist: "youssou", album: "Set", year: 1990, genre: "Mbalax", color: 2, src: "audio/7-seconds.mp3", cover: "images/pochettes/set.jpg" },
  { id: "t9", title: "Shaking the Tree", artist: "youssou", feat: "Peter Gabriel", album: "The Lion", year: 1989, genre: "Mbalax", color: 3, src: "audio/utrus-horas.mp3", cover: "images/pochettes/the-lion.jpg" },
  { id: "t10", title: "LNN", artist: "dip", feat: "Bass Thioung", album: "LNN (Loo Ñeme Ñàkk)", year: 2019, genre: "Rap Galsen", color: 6, src: "audio/boomerang.mp3", cover: "images/pochettes/loo-neme-nakk.jpg" },
  { id: "t11", title: "Esperanza", artist: "daaraj", album: "Boomerang", year: 2003, genre: "Rap Galsen", color: 1, src: "audio/boomerang.mp3", cover: "images/pochettes/boomerang.jpg" },
  { id: "t12", title: "Exodus", artist: "daaraj", album: "Boomerang", year: 2003, genre: "Rap Galsen", color: 2, src: "audio/boomerang.mp3", cover: "images/pochettes/boomerang.jpg" },
  { id: "t13", title: "Coumba", artist: "baobab", album: "Pirates Choice", year: 1989, genre: "Afro-jazz", color: 3, src: "audio/utrus-horas.mp3", cover: "images/pochettes/pirates-choice.jpg" },
  { id: "t14", title: "Jammu Africa", artist: "ismael", album: "Jammu Africa", year: 1996, genre: "Acoustique", color: 4, src: "audio/tajabone.mp3", cover: "images/pochettes/jammu-africa.jpg" },
  { id: "t15", title: "African Woman", artist: "baaba", album: "Firin' in Fouta", year: 1994, genre: "Folk Peul", color: 5, src: "audio/yela.mp3", cover: "images/pochettes/firin-in-fouta.jpg" },
  { id: "t16", title: "Boul di Tagale", artist: "cheikhlo", album: "Ne La Thiass", year: 1995, genre: "Mbalax", color: 6, src: "audio/ne-la-thiass.mp3", cover: "images/pochettes/ne-la-thiass.jpg" },
  { id: "t17", title: "Taxi Love", artist: "wally", album: "Symphonie", year: 2018, genre: "Mbalax", color: 7, src: "audio/7-seconds.mp3", cover: "images/pochettes/taxi-love.jpg" },
  { id: "t18", title: "Lo Beugue", artist: "wally", album: "Xel", year: 2015, genre: "Mbalax", color: 0, src: "audio/ne-la-thiass.mp3", cover: "images/pochettes/lo-beugue.jpg" },
  { id: "t19", title: "Musiba", artist: "dip", album: "Single", genre: "Rap Galsen", color: 1, src: "audio/boomerang.mp3", cover: "images/pochettes/musiba.jpg" },
  { id: "t20", title: "Incorrect", artist: "ngaaka", album: "Single", genre: "Rap Galsen", color: 2, src: "audio/boomerang.mp3", cover: "images/pochettes/incorrect.jpg" },
  { id: "t21", title: "Okay A Yes", artist: "ngaaka", album: "Single", genre: "Rap Galsen", color: 3, src: "audio/boomerang.mp3", cover: "images/pochettes/okay-a-yes.jpg" },
  { id: "t22", title: "Gorée", artist: "carlou", feat: "Youssou N’Dour", album: "Muzikr", year: 2010, genre: "Acoustique", color: 4, src: "audio/tajabone.mp3", cover: "images/pochettes/muzikr.jpg" },
  { id: "t23", title: "Namenala", artist: "carlou", album: "N’Deye Dior", year: 2008, genre: "Acoustique", color: 5, src: "audio/utrus-horas.mp3" }
];

// Titres mis en avant sur l'accueil
const TRENDING = ["t1", "t2", "t3", "t4", "t5", "t6"];
const FEATURED_ARTIST = "youssou";

// Playlists créées au premier lancement (ensuite sauvegardées dans le navigateur)
const DEFAULT_PLAYLISTS = [
  { id: "p1", name: "Vibes du dimanche", desc: "Pour les après-midi tranquilles à la plage.", color: 2, tracks: ["t4", "t3", "t5", "t22", "t15"] },
  { id: "p2", name: "Mbalax 2000", desc: "Les classiques qui font danser.", color: 3, tracks: ["t1", "t7", "t6", "t8", "t17", "t16"] },
  { id: "p3", name: "Focus Afro-jazz", desc: "Pour se concentrer en douceur.", color: 4, tracks: ["t3", "t13", "t4", "t23"] }
];
