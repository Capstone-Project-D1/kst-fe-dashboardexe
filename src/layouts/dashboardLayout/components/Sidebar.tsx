import GroupMenu from '@layouts/dashboardLayout/components/GroupMenu'

export interface MenuProps {
  label: string
  icon: string
  href: string
}

export interface MenuGroupProps {
  group_name: string
  menus: MenuProps[]
}

function Sidebar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const {
    canViewBrandInformation,
    canViewProduct,
    canViewFakeProductReport,
    // canViewDistributionAndTracking,
    // canViewAddDistributor,
    // canViewQuestionnaire,
  } = useAccessMenu()

  const GROUP_MENU: MenuGroupProps[] = []

  const menus = []
  if (canViewProduct())
    menus.push({ label: t('SidebarMenuProduct'), icon: IC_PRODUCT, href: ROUTES?.PRODUCT })
  if (canViewFakeProductReport())
    menus.push({
      label: t('SidebarMenuFakeProductReport'),
      icon: IC_FAKE_PRODUCT_REPORT,
      href: ROUTES?.FAKE_PRODUCT_REPORT,
    })
  GROUP_MENU.push({
    group_name: t('SidebarGroupMenuMainMenu'),
    menus: [
      { label: t('SidebarMenuDashboard'), icon: IC_DASHBOARD, href: ROUTES?.DASHBOARD },
      ...menus,
    ],
  })

  // if (canViewAddDistributor() && canViewDistributionAndTracking()) {
  //   const menus = []
  //   if (canViewAddDistributor())
  //     menus.push({
  //       label: t('SidebarMenuAddDistributor'),
  //       icon: IC_ADD_DISTRIBUTOR,
  //       href: ROUTES?.ADD_DISTRIBUTOR,
  //     })
  //   if (canViewDistributionAndTracking())
  //     menus.push({
  //       label: t('SidebarMenuDistributorAndTracking'),
  //       icon: IC_DISTRIBUTOR_AND_TRACKING,
  //       href: ROUTES?.DISTRIBUTOR_AND_TRACKING,
  //     })
  //   GROUP_MENU.push({
  //     group_name: t('SidebarGroupMenuDistributor'),
  //     menus: menus,
  //   })
  // }

  // const marketingMenus = []
  // if (canViewQuestionnaire())
  //   marketingMenus.push({
  //     label: t('SidebarMenuQuestionnaire'),
  //     icon: IC_QUESTIONAINER,
  //     href: ROUTES?.QUESTIONNAIRE,
  //   })
  // if (canViewAdsOrinformation())
  //   marketingMenus.push({
  //     label: t('SidebarMenuAdsAndInformation'),
  //     icon: IC_ADS,
  //     href: ROUTES?.ADS_AND_INFORMATION,
  //   })
  // GROUP_MENU.push({
  //   group_name: t('SidebarGroupMenuMarketing'),
  //   menus: [
  //     {
  //       label: 'Vouchers',
  //       icon: IC_VOUCHER,
  //       href: ROUTES?.ADS_AND_INFORMATION,
  //     },
  //     ...marketingMenus,
  //   ],
  // })

  GROUP_MENU.push({
    group_name: t('SidebarMenuDistribution'),
    menus: [
      {
        label: t('SidebarMenuDistributionSQR'),
        icon: IC_DISTRIBUTION,
        href: ROUTES?.DISTRIBUTION,
      },
    ],
  })

  if (canViewBrandInformation()) {
    GROUP_MENU.push({
      group_name: t('SidebarGroupMenuManagement'),
      menus: [
        {
          label: t('SidebarMenuRolesAndPermissions'),
          icon: IC_ROLES_AND_PERMISSION,
          href: ROUTES?.ROLES_AND_PERMISSION,
        },
      ],
    })
  }

  GROUP_MENU.push({
    group_name: t('SidebarGroupReport'),
    menus: [
      {
        label: t('SidebarMenuReportAnalytic'),
        icon: IC_ANALYTIC,
        href: ROUTES?.ANALYTIC,
      },
    ],
  })

  GROUP_MENU.push({
    group_name: t('SidebarGroupCampaign'),
    menus: [
      {
        label: t('SidebarMenuCampaignGiveaway'),
        icon: IC_ANALYTIC,
        href: ROUTES?.CAMPAIGN,
      },
    ],
  })

  return (
    <Flex
      id='sidebar'
      minW='270px'
      backgroundColor='#FAFAFA'
      borderRight='1px solid #E4E4E7'
      height='125vh'
      direction='column'
    >
      <Flex
        padding='30px 20px'
        direction='column'
        borderBottomWidth='1px'
        borderBottomColor='#E4E4E7'
        height='max-content'
        width='100%'
      >
        <Heading
          fontSize='16px'
          fontWeight='800'
          color='#151515'
        >
          {user?.brand.name}
        </Heading>
        <Text
          fontSize='12px'
          fontWeight='400'
          color='#151515'
        >
          {user?.role.name}
        </Text>
      </Flex>

      <Flex
        id='sidebarMenu'
        direction='column'
        padding='30px 20px'
        gap='47px'
        overflowY='auto'
      >
        {GROUP_MENU?.map((groupMenu: MenuGroupProps, groupMenuIndex: number) => {
          return (
            <GroupMenu
              key={groupMenuIndex}
              {...groupMenu}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Sidebar
