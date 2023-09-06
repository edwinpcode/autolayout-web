export const condition = [
  {
    id: 'PA000001_001',
    label: 'No Aplikasi',
    type: 'textbox',
    maxLength: '100',
    isMandatory: '1',
    rule: '',
    isReadOnly: '1',
    width: '6',
    isMultiple: '',
    hide: '',
    value: '000371002022',
    reference: {
      child: [],
    },
  },
  {
    id: 'PA000001_002',
    label: 'Tipe Nasabah',
    type: 'dropdown',
    maxLength: '100',
    isMandatory: '0',
    rule: '',
    isReadOnly: '0',
    width: '6',
    isMultiple: '',
    hide: '',
    condition: [
      {
        value: [''],
        setting: [
          {
            id: 'PA000001_004',
            property: {
              visible: '0',
              isMandatory: '0',
            },
          },
          {
            id: 'PA000001_007',
            property: {
              visible: '0',
              isMandatory: '0',
            },
          },
        ],
      },
      {
        value: ['01'],
        setting: [
          {
            id: 'PA000001_004',
            property: {
              visible: '1',
              isMandatory: '1',
            },
          },
          {
            id: 'PA000001_007',
            property: {
              visible: '0',
              isMandatory: '0',
            },
          },
        ],
      },
      {
        value: ['02'],
        setting: [
          {
            id: 'PA000001_004',
            property: {
              visible: '0',
              isMandatory: '0',
            },
          },
          {
            id: 'PA000001_007',
            property: {
              visible: '1',
              isMandatory: '1',
            },
          },
        ],
      },
    ],
    valueList: [],
    reference: {
      parent: ['PA000001_001'],
    },
  },
  {
    id: 'PA000001_004',
    label: 'No KTP',
    type: 'textbox',
    maxLength: '100',
    isMandatory: '1',
    rule: '',
    isReadOnly: '0',
    width: '12',
    isMultiple: '',
    hide: '',
    value: '1234567891234567',
    reference: {
      child: ['PA000001_003_001'],
    },
  },
  {
    id: 'PA000001_007',
    label: 'NPWP',
    type: 'textbox',
    maxLength: '100',
    isMandatory: '0',
    rule: '',
    isReadOnly: '0',
    width: '12',
    isMultiple: '',
    hide: '',
    value: '839928837822222',
    reference: {
      child: [],
    },
  },
]
