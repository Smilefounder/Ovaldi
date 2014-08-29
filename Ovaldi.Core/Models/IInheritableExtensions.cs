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
    public static class IInheritableExtensions
    {
        public static bool HasParentVersion<T>(this T obj)
            where T : IInheritable
        {
            return false;
        }

        public static bool IsLocalized<T>(this T obj, Site site)
            where T : IInheritable
        {
            return true;
        }

        public static T LastVersion<T>(this T obj, Site site)
            where T : IInheritable
        {
            return (T)obj;
        }
    }
}
