#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Routing;

namespace Ovaldi.Core.Models
{
    public partial class Page : ISiteObject, IInheritable, IIdentifiable
    {
        #region .ctor
        public Page() { }
        public Page(Site site, string fullName)
        {
            this.Site = site;
            this.AbsoluteName = fullName;
            this.Name = FullNameHelper.GetName(fullName);
        }
        public Page(Page parent, string name)
        {
            this.Site = parent.Site;
            this.AbsoluteName = FullNameHelper.Combine(parent.AbsoluteName, name);
            this.Name = name;
        }
        #endregion

        public Site Site
        {
            get;
            set;
        }

        public string UUID
        {
            get
            {
                return this.AbsoluteName;
            }
            set
            {
                this.AbsoluteName = value;
            }
        }
    }
    public partial class Page
    {

        public string Name { get; set; }
        public string AbsoluteName { get; set; }

        public bool IsDefault { get; set; }

        private bool enableTheming = true;

        public bool EnableTheming
        {
            get
            {
                return enableTheming;
            }
            set
            {
                this.enableTheming = value;
            }
        }
        private bool enableScript = true;

        public bool EnableScript
        {
            get
            {
                return enableScript;
            }
            set
            {
                enableScript = value;
            }
        }

        public HtmlMeta[] HtmlMetas { get; set; }
        private PageRoute route = new PageRoute();
        /// <summary>
        /// 
        /// </summary>
        public PageRoute[] Route
        {
            get;
            set;
            //get
            //{
            //    if (route == null)
            //    {
            //        return PageRoute.Default;
            //    }
            //    return route;
            //}
            //set
            //{
            //    route = value;
            //}
        }
        //Navigation navigation = new Navigation();

        //public Navigation Navigation
        //{
        //    get
        //    {
        //        return this.navigation;
        //    }
        //    set { this.navigation = value; }
        //}
        //PagePermission permission = new PagePermission();

        //public PagePermission Permission
        //{
        //    get { return this.permission; }
        //    set { this.permission = value; }
        //}
        public bool UseLayout
        {
            get
            {
                return !string.IsNullOrEmpty(Layout);
            }
        }
        /// <summary>
        /// wrap for Layout
        /// </summary>
        /// <value>The name of the layout template.</value>

        public string Layout
        {
            get;
            set;
        }

        /// <summary>
        /// 页面自己的Content
        /// </summary>
        public string Html { get; set; }

        public IPageContent[] PageContents { get; set; }

        //private List<PagePosition> pagePositions = new List<PagePosition>();
        //[DataMember(Order = 20)]//
        //public List<PagePosition> PagePositions
        //{
        //    get { return this.pagePositions; }
        //    set { this.pagePositions = value; }
        //}

        //private List<DataRuleSetting> dataRules = new List<DataRuleSetting>();

        //public List<DataRuleSetting> DataRules
        //{
        //    get { return this.dataRules; }
        //    set
        //    {
        //        this.dataRules = value;
        //    }
        //}

        private List<string> plugins = new List<string>();
        /// <summary>
        /// plugin要有参数
        /// </summary>
        public List<string> Plugins
        {
            get
            {
                return plugins;
            }
            set
            {
                plugins = value;
            }
        }

        //public PageType PageType { get; set; }


        public CacheSettings OutputCache { get; set; }

        //public bool EnabledCache
        //{
        //    get
        //    {
        //        return OutputCache != null && OutputCache.EnableCaching == true;
        //    }
        //}
        private Dictionary<string, string> customFields;

        public Dictionary<string, string> CustomFields
        {
            get
            {
                return customFields ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            }
            set
            {
                if (value != null)
                {
                    customFields = new Dictionary<string, string>(value, StringComparer.OrdinalIgnoreCase);
                }
                else
                {
                    customFields = value;
                }
            }
        }

        public bool Published { get; set; }

        //public string ContentTitle { get; set; }

        public string HtmlTitle { get; set; }

        //public bool Searchable { get; set; }


        public bool RequireHttps { get; set; }


        //public bool CacheToDisk { get; set; }

        /// <summary>
        /// 页面引用的脚本文件（组）
        /// 默认从站点设置的继承过来，可以自己增加或修改
        /// </summary>
        public IncludingFileSetting[] Scripts { get; set; }
        /// <summary>
        /// 页面引用的样式文件（组）
        /// 默认从站点
        /// </summary>
        public IncludingFileSetting[] Styles { get; set; }
    }
}
