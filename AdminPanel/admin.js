const AdminBro = require('admin-bro');
const uploadFeature = require('@admin-bro/upload')
const mongooseAdmin = require('@admin-bro/mongoose');

const User = require('../model/user');
const Post = require('../model/products/Post');
const Category = require('../model/products/category');
const Product = require('../model/products/Product');
const Slider = require('../model/slider');

AdminBro.registerAdapter(mongooseAdmin);
const{
    after: uploadAfterHook,
    before: uploadBeforeHook,
} = require('./components/photo-hook.js');
const services = require('../model/services');
const brands = require('../model/brands/brand');
const ManufactureStateSchema= require('../model/brands/manufacture')
const brandSlider = require('../model/brands/brandsSlider');
const brandsBanner = require('../model/brands/brandsBanner');
const RXSchema = require('../model/Order/rx');
const job = require('../model/job');
const menu = require('../model/menu');
const color = require('../model/products/color');
const mirror = require('../model/products/mirror');
const transferMethod = require('../model/products/transferMethod');
const paymentMethod = require('../model/products/paymentMethod');
const help = require('../model/help');
const manufacture = require('../model/Order/manufacture');
const param = require('../model/Params/param');
const stock = require('../model/Order/stock');
const customerSchema=require('../model/customers')
const cover = require('../model/products/cover');
const pages = require('../model/pages');
const mgmInfo = require('../model/mgmInfo');
const Offers = require('../model/Order/Offers');
const sepidarstock = require('../model/Order/sepidarstock');
const contentParent = {
    name:'content',
    icon:'eye'
}
const userParent = {
    name:'User',
    icon:'eye'
}
const brandParent = {
  name:'Brand',
  icon:'book'
}
const parameterParent = {
  name:'Parameters',
  icon:'book'
}
const orderParent = {
  name:'Order',
  icon:'book'
}
const AdminBroOptions = {
    resources:[
    {resource: User, options: { parent: userParent } },
    {resource: services, options: { parent: contentParent } },
    {resource: job, options: { parent: contentParent } },
    {resource: Offers, options: { parent: contentParent } },
    {resource: mgmInfo, options: { parent: contentParent } },
    {resource: Post, options: { parent: contentParent ,
        listProperties: ['title', 'uploadImage'],
      properties: {
        uploadImage:{
            components:{
                edit:AdminBro.bundle('./components/upload-image.tsx'),
                list:AdminBro.bundle('./components/upload-list.tsx')
            }
        },
        description: {
            type: 'richtext',
            custom: {
              modules: {
                toolbar: [['bold', 'italic'], ['link']],
              },
            },
          },
          fullDesc:{
            type: 'richtext',
            custom: {
              modules: {
                toolbar: [['bold', 'italic'], ['link']],
              },
            },
          },
    },
    
    actions:{
      new:{
          after:async(response,request,context)=>{
                return uploadAfterHook(response,request,context)
          },
          before:async(request,context)=>{
              return uploadBeforeHook(request,context)
          }
        }
      }
    }},
    {resource: pages, options: { parent: contentParent ,
      listProperties: ['title', 'uploadImage'],
    properties: {
      uploadImage:{
          components:{
              edit:AdminBro.bundle('./components/upload-image.tsx'),
              list:AdminBro.bundle('./components/upload-list.tsx')
          }
      },
      description: {
          type: 'richtext',
          custom: {
            modules: {
              toolbar: [['bold', 'italic'], ['link']],
            },
          },
        },
        shortDesc: {
          type: 'richtext',
          custom: {
            modules: {
              toolbar: [['bold', 'italic'], ['link']],
            },
          },
        },
  },
  
  actions:{
    new:{
        after:async(response,request,context)=>{
              return uploadAfterHook(response,request,context)
        },
        before:async(request,context)=>{
            return uploadBeforeHook(request,context)
        }
      },
    }
    }},
    {resource: Product, options: { parent: contentParent ,
          listProperties: ['title', 'sku', 'uploadImage','price'],
        properties: {
          uploadImage:{
              components:{
                  edit:AdminBro.bundle('./components/upload-image.tsx'),
                  list:AdminBro.bundle('./components/upload-list.tsx')
              }
          },
          description: {
              type: 'richtext',
              custom: {
                modules: {
                  toolbar: [['bold', 'italic'], ['link']],
                },
              },
            },
            fullDesc:{
              type: 'richtext',
              custom: {
                modules: {
                  toolbar: [['bold', 'italic'], ['link']],
                },
              },
            },
            imgGallery:{
              components:{
                  edit:AdminBro.bundle('./components/upload-gallery.tsx')
              }
            },
      },
      
      actions:{
        new:{
            after:async(response,request,context)=>{
                  return uploadAfterHook(response,request,context)
            },
            before:async(request,context)=>{
                return uploadBeforeHook(request,context)
            }
          }
        }
    }},
    {resource: Slider, options: { parent: contentParent ,
          listProperties: ['title', 'uploadImage','description'],
          properties: {
            uploadImage:{
                components:{
                    edit:AdminBro.bundle('./components/upload-image.tsx'),
                    list:AdminBro.bundle('./components/upload-list.tsx')
                }
            }
        },
        actions:{
          new:{
              after:async(response,request,context)=>{
                    return uploadAfterHook(response,request,context)
              },
              before:async(request,context)=>{
                  return uploadBeforeHook(request,context)
              }
          }
      }
    }},
    {resource: menu, options: { parent: contentParent ,
          listProperties: ['title', 'uploadImage','url'],
          properties: {
            uploadImage:{
                components:{
                    edit:AdminBro.bundle('./components/upload-image.tsx'),
                    list:AdminBro.bundle('./components/upload-list.tsx')
                }
            }
        },
        actions:{
          new:{
              after:async(response,request,context)=>{
                    return uploadAfterHook(response,request,context)
              },
              before:async(request,context)=>{
                  return uploadBeforeHook(request,context)
              }
          }
      }
    }},
    {resource: color, options: { parent: parameterParent ,
        listProperties: ['title', 'uploadImage','sort','colorPrice'],
        properties: {
          uploadImage:{
              components:{
                  edit:AdminBro.bundle('./components/upload-image.tsx'),
                  list:AdminBro.bundle('./components/upload-list.tsx')
              }
          }
      },
      actions:{
        new:{
            after:async(response,request,context)=>{
                  return uploadAfterHook(response,request,context)
            },
            before:async(request,context)=>{
                return uploadBeforeHook(request,context)
            }
        }
    }
    }},
    {resource: cover, options: { parent: parameterParent} },
    {resource: mirror, options: { parent: parameterParent ,
        listProperties: ['title', 'uploadImage','sort','colorPrice'],
        properties: {
          uploadImage:{
              components:{
                  edit:AdminBro.bundle('./components/upload-image.tsx'),
                  list:AdminBro.bundle('./components/upload-list.tsx')
              }
          }
      },
      actions:{
        new:{
            after:async(response,request,context)=>{
                 return uploadAfterHook(response,request,context)
            },
            before:async(request,context)=>{
                return uploadBeforeHook(request,context)
            }
        }
    }
    }},
    {resource: transferMethod, options: { parent: parameterParent } },
    {resource: paymentMethod, options: { parent: parameterParent } },
    {resource: param, options: { parent: parameterParent } },
    {resource: RXSchema, options: { parent: userParent } },
    {resource: Category, options: { parent: contentParent ,
          listProperties: ['title', 'uploadImage','parent', 'body'],
          properties: {
              uploadImage:{
                  components:{
                      edit:AdminBro.bundle('./components/upload-image.tsx'),
                      list:AdminBro.bundle('./components/upload-list.tsx')
                  }
              }
          },
          actions:{
              new:{
                  after:async(response,request,context)=>{
                      return uploadAfterHook(response,request,context)
                  },
                  before:async(request,context)=>{
                      return uploadBeforeHook(request,context)
                  }
              }
            }
          }
        },
    {resource: help, options: { parent: parameterParent ,
      properties: {
          uploadImage:{
              components:{
                  edit:AdminBro.bundle('./components/upload-image.tsx'),
                  list:AdminBro.bundle('./components/upload-list.tsx')
              }
          }
      },
      actions:{
          new:{
              after:async(response,request,context)=>{
                  return uploadAfterHook(response,request,context)
              },
              before:async(request,context)=>{
                  return uploadBeforeHook(request,context)
              }
          },
          edit:{
            after:async(response,request,context)=>{
                return uploadAfterHook(response,request,context)
            },
            before:async(request,context)=>{
                return uploadBeforeHook(request,context)
            }
        }
        }
      }
    },
    {resource: brands, options: { parent: brandParent ,
          listProperties: ['title', 'uploadImage'],
        properties: {
          uploadImage:{
              components:{
                  edit:AdminBro.bundle('./components/upload-image.tsx'),
                  list:AdminBro.bundle('./components/upload-list.tsx')
              }
          },
      },
      actions:{
        new:{
            after:async(response,request,context)=>{
                 return uploadAfterHook(response,request,context)
            },
            before:async(request,context)=>{
                return uploadBeforeHook(request,context)
            }
          }
        }
    }},
    {resource: brandSlider, options: { parent: brandParent ,
        listProperties: ['title', 'uploadImage'],
      properties: {
        uploadImage:{
            components:{
                edit:AdminBro.bundle('./components/upload-image.tsx'),
                list:AdminBro.bundle('./components/upload-list.tsx')
            }
        },
    },
    actions:{
      new:{
          after:async(response,request,context)=>{
               return uploadAfterHook(response,request,context)
          },
          before:async(request,context)=>{
              return uploadBeforeHook(request,context)
          }
        }
      }
    }},
    {resource: manufacture, options: { parent: contentParent } },
    {resource: ManufactureStateSchema, options: { parent: brandParent } },
    {resource: sepidarstock, options: { parent: contentParent } },
    {resource: customerSchema, options: { parent: userParent } },


    {resource: brandsBanner, options: { parent: brandParent ,
      listProperties: ['title', 'uploadImage'],
    properties: {
      uploadImage:{
          components:{
              edit:AdminBro.bundle('./components/upload-image.tsx'),
              list:AdminBro.bundle('./components/upload-list.tsx')
          }
      },
  },
  actions:{
    new:{
        after:async(response,request,context)=>{
             return uploadAfterHook(response,request,context)
        },
        before:async(request,context)=>{
            return uploadBeforeHook(request,context)
        }
      }
    }
  } }
    ],
    locale: {
        translations: {
        actions: {
            new: 'جدید',
            list:'لیست'
            }
        },
        buttons: {
            save: 'ذخیره'
        }
    }
}
const adminBro = new AdminBro(AdminBroOptions);


module.exports = adminBro;