// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'home',
        path: PATH_DASHBOARD.general.home,
        icon: ICONS.dashboard
      },
      {
        title: 'My Universe',
        // path: PATH_DASHBOARD.general.templates,
        icon: ICONS.booking,
        children: [
          { title: 'companies', path: PATH_DASHBOARD.general.companies, icon: ICONS.booking },
          { title: 'portfolio', path: PATH_DASHBOARD.general.portfolios, icon: ICONS.banking }
        ]
      },
      {
        title: 'Corporate Framework',
        // path: PATH_DASHBOARD.general.templates,
        icon: ICONS.booking,
        children: [
          { title: 'ESG Weightages', path: '#', icon: ICONS.booking, disabled: true },
          { title: 'Materiality matrix', path: '#', icon: ICONS.booking, disabled: true },
          { title: 'Portfolio weightages', path: '#', icon: ICONS.banking, disabled: true }
        ]
      },
      {
        title: 'ESG Framework',
        // path: PATH_DASHBOARD.general.templates,
        icon: ICONS.kanban,
        children: [
          { title: 'Metrics', path: PATH_DASHBOARD.general.templates, icon: ICONS.booking },
          { title: 'Data Indicators', path: '#', icon: ICONS.banking, disabled: true },
          { title: 'Industry Classification', path: '#', icon: ICONS.banking, disabled: true }
        ]
      },
      {
        title: 'Risk Framework',
        // path: PATH_DASHBOARD.general.templates,
        icon: ICONS.analytics,
        children: [
          { title: 'Risk Classifications', path: '#', icon: ICONS.booking, disabled: true },
          { title: 'Risk Monitoring', path: '/dashboard/news', icon: ICONS.booking, disabled: false },
          { title: 'Risk reporting', path: '#', icon: ICONS.booking, disabled: true },
          { title: 'Portfolio Risks', path: '#', icon: ICONS.banking, disabled: true }
        ]
      }
      // { title: 'portfolio', path: PATH_DASHBOARD.general.portfolios, icon: ICONS.analytics },
      // { title: 'simulations', path: PATH_DASHBOARD.general.customPortfolioSelect, icon: ICONS.kanban },
      // { title: 'companies', path: PATH_DASHBOARD.general.companies, icon: ICONS.banking }
    ]
  }

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // MANAGEMENT : USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'profile', path: PATH_DASHBOARD.user.profile },
  //         { title: 'cards', path: PATH_DASHBOARD.user.cards },
  //         { title: 'list', path: PATH_DASHBOARD.user.list },
  //         { title: 'create', path: PATH_DASHBOARD.user.newUser },
  //         { title: 'edit', path: PATH_DASHBOARD.user.editById },
  //         { title: 'account', path: PATH_DASHBOARD.user.account }
  //       ]
  //     },

  //     // MANAGEMENT : E-COMMERCE
  //     {
  //       title: 'e-commerce',
  //       path: PATH_DASHBOARD.eCommerce.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
  //         { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
  //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
  //         { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
  //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
  //         { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
  //         { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
  //       ]
  //     },

  //     // MANAGEMENT : BLOG
  //     {
  //       title: 'blog',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'posts', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'post', path: PATH_DASHBOARD.blog.postById },
  //         { title: 'new post', path: PATH_DASHBOARD.blog.newPost }
  //       ]
  //     }
  //   ]
  // },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">2</Label>
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban
  //     }
  //   ]
  // }
];

export default sidebarConfig;
