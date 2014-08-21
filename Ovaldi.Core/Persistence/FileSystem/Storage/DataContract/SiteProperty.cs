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
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage.DataContract
{
    [DataContract(Name = "Site", Namespace = "Ovaldi.Core.Models")]
    internal class SiteProperty
    {
        [DataMember(Name = "AbsoluteName")]
        public string AbsoluteName { get; set; }
    }
}
