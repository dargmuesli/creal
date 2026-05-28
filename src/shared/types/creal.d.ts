export interface CrealGig {
  dateEnd: string
  dateStart: string
  location: string
  title: string
  description: string
  image: {
    url: string
  }
  url: string
}

export interface CrealEvent {
  gigs?: (CrealGig & {
    documentId: string
    id: number
  })[]
}

export interface CrealFaq {
  answer: string
  title: string
  isFocused: boolean
}

export interface CrealTestimonial {
  link?: string
  name: string
  picture: {
    url: string
  }
  quote: string
  role: string
}
