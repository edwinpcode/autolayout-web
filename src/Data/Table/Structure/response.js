export const structures = {
  caption: 'Pengajuan Awal',
  canSelectAll: false,
  header: [
    {
      label: 'Action',
      accessor: 'action_button',
      type: 'button',
      item: [
        {
          id: 'SDE_001_001',
          label: 'Detail',
          type: 'anchor',
          active: '1',
          order: '1',
          isRedirect: '1',
          needConfirm: '0',
          url: {
            path: '/form',
            param: ['SDE_002'],
          },
        },
      ],
    },
    {
      label: 'No Aplikasi',
      accessor: 'SDE_002',
      type: 'text',
    },
    {
      label: 'Nama Nasabah',
      accessor: 'SDE_003',
      type: 'text',
    },
    {
      label: 'Type Nasabah',
      accessor: 'SDE_004',
      type: 'text',
    },
    {
      label: 'No KTP',
      accessor: 'SDE_005',
      type: 'text',
    },
    {
      label: 'NPWP',
      accessor: 'SDE_006',
      type: 'text',
    },
  ],
  topAction: [
    {
      id: '113',
      label: 'Filter',
      type: 'buttonModal',
      icon: 'fal fa-filter',
      className: 'btn btn-sm btn-info',
      dataTarget: 'filterModal',
      active: '1',
      isRedirect: '0',
      needConfirm: '0',
      contents: {
        data: [
          {
            id: 'filter_5',
            label: 'No Aplikasi',
            type: 'textbox',
            data: [],
          },
          {
            id: 'filter_8',
            label: 'Type Nasabah',
            type: 'dropdown',
            data: [],
          },
          {
            id: 'filter_7',
            label: 'No Ktp',
            type: 'textbox',
            data: [],
          },
          {
            id: 'filter_6',
            label: 'Nama Nasabah',
            type: 'textbox',
            data: [],
          },
        ],
        action: [
          {
            actionId: 'ACT000001',
            label: 'Search',
            icon: 'fal fa-search',
            flag: 'search',
            className: 'fas fa-search',
            isRedirect: '0',
            needConfirm: '0',
            url: {
              path: '',
            },
          },
        ],
      },
    },
    {
      id: '114',
      label: 'Input Data',
      type: 'button',
      icon: 'fal fa-plus',
      className: 'btn btn-sm btn-info',
      dataTarget: ' ',
      active: '1',
      isRedirect: '1',
      needConfirm: '0',
      url: {
        path: '/form',
        param: [],
      },
    },
  ],
  bottomAction: [],
  headerVisibility: {
    SDE_002: false,
  },
}
