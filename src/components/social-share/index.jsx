import React from 'react'
import { FacebookIcon } from './facebook-icon'
import { TwitterIcon } from './twitter-icon'
import { shareToTwitter, shareToFacebook } from '../../utils/share'

import './index.scss'

export const SocialShare = ({ title, author, social}) => {
  const text = (author) =>
    `Recommend on "${title}" written by @${author}`

  const onClickTwitterIcon = e => {
    e.preventDefault()

    return shareToTwitter(window.location.href, text(social.twitter))
  }

  const onClickFacebookIcon = e => {
    e.preventDefault()
    return shareToFacebook(window.location.href, text(social.facebook))
  }

  return (
    <div className="social-share">
      <FacebookIcon onClick={onClickFacebookIcon} />
      <TwitterIcon onClick={onClickTwitterIcon} />
    </div>
  )
}
