import MenuItem from '@layouts/dashboardLayout/components/MenuItem'
import { MenuGroupProps, MenuProps } from '@layouts/dashboardLayout/components/Sidebar'

interface GroupMenuProps extends MenuGroupProps {}

function GroupMenu(props: GroupMenuProps) {
  const { group_name, menus } = props

  return (
    <Flex
      direction='column'
      gap='21px'
    >
      <Text
        fontSize='16px'
        fontWeight='700'
        color='#151515'
      >
        {group_name}
      </Text>
      <Flex
        direction='column'
        gap='12px'
      >
        {menus?.map((menu: MenuProps, menuIndex: number) => {
          return (
            <MenuItem
              key={menuIndex}
              {...menu}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}

export default GroupMenu
