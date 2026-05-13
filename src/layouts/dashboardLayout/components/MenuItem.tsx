import { MenuProps } from '@layouts/dashboardLayout/components/Sidebar'
import { Link as ReactRouterLink, useLocation } from 'react-router-dom'

interface MenuItemProps extends MenuProps {}

function MenuItem(props: MenuItemProps) {
  const { href, icon, label } = props

  const location = useLocation()

  return (
    <Flex
      as={ReactRouterLink}
      to={href}
      padding='12px 14px'
      alignItems='center'
      gap='12px'
      backgroundColor={location?.pathname?.startsWith(href) ? '#0988A3' : 'unset'}
      borderRadius='5px'
      cursor='pointer'
      transition='all 0.2s ease-in-out'
      role='group'
      _hover={{
        backgroundColor: location?.pathname?.startsWith(href)
          ? '#0988A3'
          : 'rgba(9, 136, 163, 0.15)',
        transform: 'translateX(4px)',
      }}
    >
      <Image
        src={icon}
        right='15px'
        width='15px'
        filter={
          location?.pathname?.startsWith(href)
            ? 'brightness(0) invert(1)'
            : 'brightness(0) invert(59%)'
        }
      />
      <Text
        fontSize='14px'
        fontWeight='600'
        color={location?.pathname?.startsWith(href) ? 'white' : '#969696'}
      >
        {label}
      </Text>
    </Flex>
  )
}

export default MenuItem
