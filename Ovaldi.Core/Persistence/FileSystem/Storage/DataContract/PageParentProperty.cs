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
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Ovaldi.Core.Persistence.FileSystem.Storage.DataContract
{
    [DataContract(Name = "Parent", Namespace = "Ovaldi.Core.Models")]
    internal class PageParentProperty : ISiteObject
    {
        [DataMember(Name = "Site")]
        public Site Site { get; set; }
        [DataMember(Name = "AbsoluteName")]
        public string AbsoluteName { get; set; }
    }
}
