import { FiUser, FiLogOut } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@routes'

function Navbar() {
  const { t } = useTranslation()
  const { logout, user } = useAuth()
  const location = useLocation()

  const getPageTitle = () => {
    const p = location.pathname

    if (p.startsWith(ROUTES.ROLES_AND_PERMISSION)) return 'Roles & Permissions'

    if (p.startsWith(ROUTES.DISTRIBUTION_DETAIL)) return 'Distribution SQR'
    if (p.startsWith(ROUTES.DISTRIBUTION)) return 'Distribution SQR'

    if (p.startsWith(ROUTES.ANALYTIC_USER_DATA)) return 'Analytic'
    if (p.startsWith(ROUTES.ANALYTIC_SCAN_BY_LOCATION)) return 'Analytic'
    if (p.startsWith(ROUTES.ANALYTIC)) return 'Analytic'

    if (p.startsWith(ROUTES.PROFILE)) return 'User Profile'
    if (p.startsWith(ROUTES.CHANGE_PASSWORD)) return 'Change Password'
    if (p.startsWith(ROUTES.NOTIFICATION)) return 'Notification'
    if (p.startsWith(ROUTES.FAKE_PRODUCT_REPORT)) return 'Fake Product Report'
    if (p.startsWith(ROUTES.CAMPAIGN)) return 'Campaign'
    if (p.startsWith(ROUTES.PRODUCT)) return 'Product'
    if (p.startsWith(ROUTES.DASHBOARD)) return 'Dashboard'

    const segments = location.pathname.split('/').filter(Boolean)
    return segments.length > 0
      ? segments[segments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'Dashboard'
  }

  const currentDate = format(new Date(), 'dd MMM, yyyy')

  return (
    <Flex
      position='sticky'
      top='0'
      zIndex='999'
      padding='25px 50px'
      backgroundColor='white'
      width='100%'
      alignItems='center'
      justifyContent='space-between'
      borderBottom='1px solid #E4E7EC'
    >
      <Text
        fontSize='24px'
        fontWeight='700'
        color='#101828'
      >
        {getPageTitle()}
      </Text>

      <Flex
        alignItems='center'
        gap={{ base: '12px', md: '24px' }}
        marginLeft='auto'
      >
        <Text
          fontSize='14px'
          color='#667085'
          fontWeight='500'
          display={{ base: 'none', md: 'block' }}
        >
          {currentDate}
        </Text>

        <NotificationNavbar />

        <Divider
          orientation='vertical'
          borderColor='#E4E7EC'
          height='30px'
        />

        <Menu>
          <MenuButton>
            <Flex
              alignItems='center'
              gap='12px'
            >
              <Avatar
                size='sm'
                width='36px'
                height='36px'
                name={user?.name}
                src={
                  user?.brand?.avatar
                    ? import.meta.env.VITE_S3?.replace(':imageKey', user.brand.avatar)
                    : undefined
                }
              />
              <Text
                color='#101828'
                fontWeight='600'
                fontSize='14px'
                display={{ base: 'none', md: 'block' }}
              >
                {user?.name}
              </Text>
              <Image
                src={IC_ARROW_DOWN}
                width='16px'
                height='16px'
              />
            </Flex>
          </MenuButton>
          <MenuList
            borderRadius='8px'
            border='1px solid #E5E5E5'
            boxShadow='0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10)'
          >
            <Flex padding='6px 12px'>
              <LanguageChanger />
            </Flex>
            <MenuDivider />
            <MenuItem
              icon={
                <FiUser
                  size='20px'
                  strokeWidth='1.5'
                />
              }
              as={Link}
              to={ROUTES.PROFILE}
              color='#475467'
              fontWeight='500'
            >
              {t('NavbarProfile')}
            </MenuItem>
            <MenuItem
              icon={
                <FiLogOut
                  size='20px'
                  strokeWidth='1.5'
                />
              }
              color='red.600'
              fontWeight='500'
              onClick={logout}
            >
              {t('NavbarLogout')}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default Navbar
