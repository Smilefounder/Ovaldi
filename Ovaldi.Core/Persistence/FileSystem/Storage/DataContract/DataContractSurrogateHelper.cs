#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage.DataContract
{
    public static class DataContractSurrogateHelper
    {
        public static IDataContractSurrogate GetDataContractSurrogate(Type type)
        {
            if (type != typeof(Site) && typeof(ISiteObject).IsAssignableFrom(type))
            {
                return new SiteObjectDataContractSurrogate();
            }
            return null;
        }
    }
}
