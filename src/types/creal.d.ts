export interface CrealEvent {
  dateEnd: string
  dateStart: string
  location: string
  title: string
  description: string
  image: {
    data: any
  }
  url: string
}

export interface CrealFaq {
  answer: string
  title: string
  isFocused: boolean
}
