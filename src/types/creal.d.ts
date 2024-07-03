export interface CrealEvent {
  dateEnd: string
  dateStart: string
  location: string
  title: string
  description: string
  image: {
    data: {
      attributes: {
        url: string
      }
    }
  }
  url: string
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
    data?: {
      attributes: {
        url: string
      }
    }
  }
  quote: string
  role: string
}
