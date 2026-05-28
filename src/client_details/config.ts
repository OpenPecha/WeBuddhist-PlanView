import rawConfig from './config.json'

export interface ClientDetails {
  client: string
  sign_up: string
  about_plan_id: string
  banner_image: string
  default_image: boolean
  primary_color: string
  timestamps?: string
  video_link?: string
}

const config = rawConfig as ClientDetails[]

export default config
