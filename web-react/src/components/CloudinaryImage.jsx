import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen'
import {
  AdvancedImage,
  lazyload,
  responsive,
  placeholder,
} from '@cloudinary/react'

import { thumbnail, fill } from '@cloudinary/url-gen/actions/resize'
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity'
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn'

const CloudinaryImage = ({ src, large, responsiv, ...rest }) => {
  const getPublicId = (url) => {
    if (!url) {
      return 'v1627893621/user_qvwhs7.png'
    }

    return url.replace(
      'https://res.cloudinary.com/firstlovecenter/image/upload/',
      ''
    )
  }

  const size = large && 'large'

  const dimensions = {
    height: large ? 300 : 150,
    width: large ? 300 : 150,
  }

  let plugins = [
    lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.1 }),
    placeholder(),
  ]

  if (responsiv) {
    plugins = [
      lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.1 }),
      responsive({ steps: [800, 1000, 1400] }),
      placeholder({ mode: 'blur' }),
    ]
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'firstlovecenter',
    },
  })
  const image = cld.image(getPublicId(src))

  switch (size) {
    case 'large':
      image.resize(
        fill()
          .width(dimensions.width)
          .height(dimensions.height)
          .gravity(focusOn(FocusOn.face()))
      )
      break
    default:
      image.resize(
        thumbnail()
          .width(dimensions.width)
          .height(dimensions.height)
          .zoom(0.7)
          .gravity(focusOn(FocusOn.face()))
      )
      break
  }

  return <AdvancedImage cldImg={image} plugins={plugins} {...rest} />
}

export default CloudinaryImage
