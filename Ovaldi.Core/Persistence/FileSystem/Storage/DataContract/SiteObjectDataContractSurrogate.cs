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
    public class SiteObjectDataContractSurrogate : IDataContractSurrogate
    {
        #region Not implemented
        public virtual object GetCustomDataToExport(Type clrType, Type dataContractType)
        {
            return null;
        }

        public virtual object GetCustomDataToExport(System.Reflection.MemberInfo memberInfo, Type dataContractType)
        {
            return null;
        }
        public virtual Type GetReferencedTypeOnImport(string typeName, string typeNamespace, object customData)
        {
            return null;
        }

        public virtual System.CodeDom.CodeTypeDeclaration ProcessImportedType(System.CodeDom.CodeTypeDeclaration typeDeclaration, System.CodeDom.CodeCompileUnit compileUnit)
        {
            return null;
        }
        public virtual void GetKnownCustomDataTypes(System.Collections.ObjectModel.Collection<Type> customDataTypes)
        {

        }
        #endregion

        public virtual Type GetDataContractType(Type type)
        {
            return type == typeof(Site) ? typeof(SiteProperty) : type;
        }

        public virtual object GetDeserializedObject(object obj, Type targetType)
        {
            if (obj is SiteProperty)
            {
                return new Site(((SiteProperty)obj).AbsoluteName);
            }
            return obj;
        }

        public virtual object GetObjectToSerialize(object obj, Type targetType)
        {
            if (obj is Site)
            {
                return new SiteProperty() { AbsoluteName = ((Site)obj).AbsoluteName };
            }
            return obj;
        }

    }
}
