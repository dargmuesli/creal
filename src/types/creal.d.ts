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
