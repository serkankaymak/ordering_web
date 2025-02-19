// Site tercihlerini temsil eden model (iç yardımcı sınıf, export edilmiyor)
export class SitePreferenceModel {
  denemeCount: number = 1;
  showInnerProductsOnProductDetailCard: boolean = true;
  useTransitionableProductCard: boolean = true;
  showNameAndPriceOnProductCard: boolean = true;

  constructor(init?: Partial<SitePreferenceModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  /**
   * Mevcut nesnenin bir kopyasını oluşturur ve isteğe bağlı olarak belirtilen alanları günceller.
   * @param updatedFields - Güncellenmek istenen alanlar.
   * @returns Yeni bir `SitePreferenceModel` örneği.
   */
  copy(updatedFields: Partial<SitePreferenceModel>): SitePreferenceModel {
    return new SitePreferenceModel({
      ...this,
      ...updatedFields,
    });
  }

  /**
   * JSON verisinden `SitePreferenceModel` örneği oluşturur.
   * @param json - JSON verisi.
   * @returns Yeni bir `SitePreferenceModel` örneği.
   */
  static fromJson(json: any): SitePreferenceModel {
    return new SitePreferenceModel({
      showInnerProductsOnProductDetailCard: json.showInnerProductsOnProductDetailCard ?? true,
      useTransitionableProductCard: json.useTransitionableProductCard ?? true,
      denemeCount: json.denemeCount ?? 0,
      showNameAndPriceOnProductCard: json.showNameAndPriceOnProductCard ?? true,
    });
  }
}