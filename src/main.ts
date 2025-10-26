// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.
// Il tipo deve includere le seguenti proprietà:
//     id: numero identificativo, non modificabile
//     name: nome completo, stringa non modificabile
//     birth_year: anno di nascita, numero
//     death_year: anno di morte, numero opzionale
//     biography: breve biografia, stringa
//     image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year:number,
  death_year?: number,
  biography: string,
  image: string
};

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
//     most_famous_movies: una tuple di 3 stringhe
//     awards: una stringa
//     nationality: una stringa tra un insieme definito di valori.
//     Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Actress = Person  & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese"
}

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isActress(dati: unknown) : dati is Actress {
  if (
    dati && // controlliamo se è trusly (se è true)
    typeof dati === "object" && // controlliamo se è un oggetto
    dati !== null && // controlliamo se è diverso da null
    "id" in dati && typeof dati.id === "number" && // controlliamo se id è un numero
    "name" in dati && typeof dati.name === "string" && // controlliamo se name è una stringa
    "birth_year" in dati && typeof dati.birth_year === "number" && // controlliamo se birth_year è un numero
    "death_year" in dati && typeof dati.death_year === "number" && // controlliamo se death_year è un numero
    "biography" in dati && typeof dati.biography === "string" && // controlliamo se biography è una stringa
    "image" in dati && typeof dati.image === "string" && // controlliamo se image è una stringa
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array && // controlliamo se most_famous_movies è un array
    dati.most_famous_movies.length === 3 && // controlliamo se most_famous_movies è una tuple di 3 elementi
    dati.most_famous_movies.every(m => typeof m === "string") && // controlliamo se la tuple di stringe
    "awards" in dati && typeof dati.awards === "string" && // controlliamo se awards e una stringa
    "nationality" in dati &&
    typeof dati.nationality === "string" && // controlliamo se awards e una stringa
    (
      dati.nationality === "American"  ||
      dati.nationality === "British"  ||
      dati.nationality === "Australian"  ||
      dati.nationality === "Israeli-American"  ||
      dati.nationality === "South African"  ||
      dati.nationality === "French"  ||
      dati.nationality === "Indian"  ||
      dati.nationality === "Israeli"  ||
      dati.nationality === "Spanish"  ||
      dati.nationality === "South Korean"  ||
      dati.nationality === "Chinese"
    )
  ) {
    return true
  }
  return false
}

async function getActress(id : number) : Promise<Actress | null> {
  try{
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const responseData : unknown = await response.json();
    if (!isActress(responseData)) {
      throw new Error("Formato dati non valido");
    }
    return responseData;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    } else {
      console.error("Errore sconosciuto:", err);
    }
    return null;
  }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:
// GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.

async function getAllActresses() : Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    if (!response.ok) {
    throw new Error(`Errore: ${response.status}: ${response.statusText}`);
    }
    const responseData : unknown = await response.json();
    if (!(responseData instanceof Array)) {
      throw new Error("Errore: non è un array");
    }
    const ActressValidate : Actress[]= responseData.filter(a => isActress(a));
    return ActressValidate;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    }
    return [];
  }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(actressIds : number[]) : Promise<(Actress | null)[]> {
  try {
    const promises = actressIds.map((aId => getActress(aId)));
    return await Promise.all(promises);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    }
  }
  return [];
}

// 🎯 BONUS 1
// Crea le funzioni:
//     createActress
//     updateActress
// Utilizza gli Utility Types:
//     Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
//     Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.

function createActress(data : Omit<Actress, "id">) : Actress {
  return {
    ...data, id: Math.floor(Math.random() * 1000),
  }
}

function updateActress(actress : Actress, updates : Partial<Actress>) : Actress {
  return {
    ...actress, ...updates, id: actress.id, name: actress.name
  }
}

// 🎯 BONUS 2
// Crea un tipo Actor, che estende Person con le seguenti differenze rispetto ad Actress:
//     known_for: una tuple di 3 stringhe
//     awards: array di una o due stringhe
//     nationality: le stesse di Actress più:
//     Scottish, New Zealand, Hong Kong, German, Canadian, Irish.
// Implementa anche le versioni getActor, getAllActors, getActors, createActor, updateActor.

type Actor = Person & {
  known_for: [string, string, string],
  awards: [string] | [string, string],
  nationality: Actress["nationality"] | "Scottish" | "New Zealand" | "Hong Kong" | "German" | "Canadian" | "Irish"
}

function isActor(dati: unknown) : dati is Actor {
  if (
    dati && // controlliamo se è trusly (se è true)
    typeof dati === "object" && // controlliamo se è un oggetto
    dati !== null && // controlliamo se è diverso da null
    "id" in dati && typeof dati.id === "number" && // controlliamo se id è un numero
    "name" in dati && typeof dati.name === "string" && // controlliamo se name è una stringa
    "birth_year" in dati && typeof dati.birth_year === "number" && // controlliamo se birth_year è un numero
    "death_year" in dati && typeof dati.death_year === "number" && // controlliamo se death_year è un numero
    "biography" in dati && typeof dati.biography === "string" && // controlliamo se biography è una stringa
    "image" in dati && typeof dati.image === "string" && // controlliamo se image è una stringa
    "known_for" in dati &&
    dati.known_for instanceof Array && // controlliamo se known_for è un array
    dati.known_for.length === 3 && // controlliamo se known_for è una tuple di 3 elementi
    dati.known_for.every(known => typeof known === "string") && // controlliamo se la tuple di stringe
    "awards" in dati &&
    dati.awards instanceof Array  && // controlliamo se awards è un array
    (dati.awards.length === 1 || dati.awards.length === 2) && // controlliamo se awards è una tuple di una o due stringe
    "nationality" in dati &&
    typeof dati.nationality === "string" && // controlliamo se awards e una stringa
    (
      dati.nationality === "American"  ||
      dati.nationality === "British"  ||
      dati.nationality === "Australian"  ||
      dati.nationality === "Israeli-American"  ||
      dati.nationality === "South African"  ||
      dati.nationality === "French"  ||
      dati.nationality === "Indian"  ||
      dati.nationality === "Israeli"  ||
      dati.nationality === "Spanish"  ||
      dati.nationality === "South Korean"  ||
      dati.nationality === "Chinese" ||
      dati.nationality === "Scottish" ||
      dati.nationality === "New Zealand" ||
      dati.nationality === "Hong Kong" ||
      dati.nationality === "German" ||
      dati.nationality === "Canadian" ||
      dati.nationality === "Irish"

    )
  ) {
    return true
  }
  return false
}

async function getActor(id : number) : Promise<Actor | null> {
  try{
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const responseData : unknown = await response.json();
    if (!isActor(responseData)) {
      throw new Error("Formato dati non valido");
    }
    return responseData;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    } else {
      console.error("Errore sconosciuto:", err);
    }
    return null;
  }
}

async function getAllActor() : Promise<Actor[]> {
  try {
    const response = await fetch(`http://localhost:3333/actor`);
    if (!response.ok) {
    throw new Error(`Errore: ${response.status}: ${response.statusText}`);
    }
    const responseData : unknown = await response.json();
    if (!(responseData instanceof Array)) {
      throw new Error("Errore: non è un array");
    }
    const ActorValidate : Actor[]= responseData.filter(a => isActor(a));
    return ActorValidate;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    }
    return [];
  }
}

async function getActorId(actorIds : number[]) : Promise<(Actor | null)[]> {
  try {
    const promises = actorIds.map((aId => getActor(aId)));
    return await Promise.all(promises);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dei dai:", err.message);
    }
  }
  return [];
}

function createActor(data : Omit<Actor, "id">) : Actor {
  return {
    ...data, id: Math.floor(Math.random() * 1000),
  }
}

function updateActor(actor : Actor, updates : Partial<Actor>) : Actor {
  return {
    ...actor, ...updates, id: actor.id, name: actor.name
  }
}

// 🎯 BONUS 3
// Crea la funzione createRandomCouple che usa getAllActresses e getAllActors per restituire un’array che ha sempre due elementi: al primo posto una Actress casuale e al secondo posto un Actor casuale.

async function createRandomCouple() : Promise<[Actress, Actor] | null> {
  const [actresses, actors] = await Promise.all([getAllActresses(), getAllActor()]);
  const randomActress = actresses[Math.floor(Math.random() * actresses.length)];
  const randomActors = actors[Math.floor(Math.random() * actors.length)];
  if (actresses.length === 0 || actors. length === 0) {
    return null;
  }
  return [randomActress, randomActors];
}