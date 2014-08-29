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
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Models
{
    public partial class Layout : ISiteObject, IIdentifiable
    {
        public Layout()
        {

        }
        public Layout(Site site, string name)
        {
            this.Site = site;
            this.Name = name;
        }
        public Site Site
        {
            get;
            set;
        }

        public string UUID
        {
            get
            {
                return this.Name;
            }
            set
            {
                this.Name = value;
            }
        }
    }
    public partial class Layout : ISiteObject, IInheritable
    {
        public string Name { get; set; }
        public string TemplateType { get; set; }
        public string TemplateExtension { get; set; }
        public string Body { get; set; }
        public string[] Plugins { get; set; }
    }
}
