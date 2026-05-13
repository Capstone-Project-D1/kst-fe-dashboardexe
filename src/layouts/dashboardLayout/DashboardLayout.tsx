import Navbar from '@layouts/dashboardLayout/components/Navbar'
import Sidebar from '@layouts/dashboardLayout/components/Sidebar'
import { Outlet } from 'react-router-dom'


function DashboardLayout() {
  return (
    <div
      width='100%'
    >
      <Sidebar />
      <div
        direction='column'
        flex='1'
        minWidth='0'
        overflow='hidden'
      >
        <Navbar />
        <div
          flex='1'
          minHeight='0'
          backgroundColor='#edeff3'
          overflowY='auto'
        >
          <Container
            maxWidth='container.xl'
            paddingX='3rem'
          >
            <Outlet />
          </Container>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default DashboardLayout
