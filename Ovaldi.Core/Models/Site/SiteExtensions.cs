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
    public static class SiteExtensions
    {
        public static string PREFIX_FRONT_DEBUG_URL = "dev~";

        public static string GetVersionUsedInUrl(this Site site)
        {
            return DateTime.UtcNow.ToString("yyyy-MM-dd");
            //StringBuilder sb = new StringBuilder();
            //while (site != null)
            //{
            //    sb.AppendFormat("{0}!", (site.AsActual().Version ?? "1.0.0.0").Replace(".", "_"));
            //    site = site.Parent;
            //}
            //return sb.Remove(sb.Length - 1, 1).ToString();
        }  
        public static string GetDisplayText(this Site site)
        {
            return (string.IsNullOrEmpty(site.DisplayName) == true ? site.Name : site.DisplayName);
        }
    }
}
